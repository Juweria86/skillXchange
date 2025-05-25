"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Message, Chat } from "../types/message"
import { getMessages, sendMessage } from "../services/messageService"
import {
  initializeSocket,
  subscribeToMessages,
  sendSocketMessage,
  markMessagesAsRead,
  subscribeToUserStatus,
  unsubscribeFromMessages, // <-- import this
} from "../services/socketService"
import { getConversations as fetchConversations } from "../services/conversationService"
import { useSelector } from "react-redux"
import { useRef } from "react"

interface MessageContextType {
  conversations: Chat[]
  setConversations: React.Dispatch<React.SetStateAction<Chat[]>>
  currentChat: Chat | null
  setCurrentChat: React.Dispatch<React.SetStateAction<Chat | null>>
  messages: Message[]
  sendNewMessage: (text: string) => Promise<void>
  loading: boolean
  error: string | null
  markAsRead: (chatId: string) => void
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [socket, setSocket] = useState<any>(null)
  const token = localStorage.getItem("token")
  const userId = useSelector((state) => state.auth.user?.id || state.auth.user?._id)
  const userIdRef = useRef(userId)

  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  // Initialize socket connection
  useEffect(() => {
    if (token) {
      const socketInstance = initializeSocket(token)
      setSocket(socketInstance)

      // Subscribe to new messages
      subscribeToMessages((newMessage) => {
        // Always use latest userId
        const myUserId = userIdRef.current
        // Determine the other participant in the conversation
        const otherUserId =
          newMessage.sender === myUserId ? newMessage.receiver : newMessage.sender

        // If the message is for the currently open chat, append to messages
        setCurrentChat((current) => {
          if (current && current.id === otherUserId) {
            setMessages((prev) => [...prev, newMessage])
          }
          return current
        })

        // Update conversation list with new message
        setConversations((prev) => {
          const updatedConversations = [...prev]
          const conversationIndex = updatedConversations.findIndex(
            (conv) => conv.id === otherUserId
          )

          if (conversationIndex !== -1) {
            const conversation = { ...updatedConversations[conversationIndex] }
            conversation.lastMessage = {
              text: newMessage.text,
              time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isRead: false,
              sender: newMessage.sender === myUserId ? "you" : "them",
            }

            // If the message is not from me and not in the open chat, increment unread
            if (newMessage.sender !== myUserId) {
              // Only increment unread if not currently viewing this chat
              if (!currentChat || currentChat.id !== otherUserId) {
                conversation.unread += 1
              }
            }

            updatedConversations[conversationIndex] = conversation
          }
          return updatedConversations
        })
      })

      // Subscribe to user status changes
      subscribeToUserStatus(({ userId, online }) => {
        setConversations((prev) => {
          return prev.map((conv) => {
            if (conv.user._id === userId) {
              return {
                ...conv,
                user: {
                  ...conv.user,
                  online,
                },
              }
            }
            return conv
          })
        })
      })

      return () => {
        // Clean up socket connection and listeners
        unsubscribeFromMessages()
        if (socketInstance) {
          socketInstance.disconnect()
        }
      }
    }
  }, [token, userId])

  // Load conversations
  useEffect(() => {
    if (token) {
      setLoading(true)

      fetchConversations(token)
        .then((data) => {
          setConversations(data)

          // Set first conversation as current if none selected
          if (data.length > 0 && !currentChat) {
            setCurrentChat(data[0])
          }
        })
        .catch((err) => {
          console.error("Error loading conversations:", err)
          setError("Failed to load conversations. Please try again.")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [token])

  // Load messages when current chat changes
  useEffect(() => {
    if (currentChat && token) {
      setLoading(true)
      setError(null)

      getMessages(currentChat.id, token)
        .then((data) => {
          setMessages(data)

          // Mark messages as read
          if (currentChat.unread > 0) {
            markMessagesAsRead(currentChat.id)

            // Update conversation to mark messages as read
            setConversations((prev) => {
              return prev.map((conv) => {
                if (conv.id === currentChat.id) {
                  return {
                    ...conv,
                    unread: 0,
                    lastMessage: {
                      ...conv.lastMessage,
                      isRead: true,
                    },
                  }
                }
                return conv
              })
            })
          }
        })
        .catch((err) => {
          console.error("Error loading messages:", err)
          setError("Failed to load messages. Please try again.")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [currentChat, token])

  const sendNewMessage = async (text: string) => {
    if (!currentChat || !token || !text.trim()) return

    try {
      // Optimistically add message to UI
      const tempId = Date.now().toString()
      const optimisticMessage: Message = {
        _id: tempId,
        sender: userId as string,
        receiver: currentChat.id,
        text,
        createdAt: new Date().toISOString(),
        status: "sent",
      }

      setMessages((prev) => [...prev, optimisticMessage])

      // Send message via socket for real-time delivery
      sendSocketMessage({
        receiverId: currentChat.id,
        text,
      })

      // Also send via REST API as backup
      const sentMessage = await sendMessage(currentChat.id, text, token)

      // Replace optimistic message with actual message from server
      setMessages((prev) => prev.map((msg) => (msg._id === tempId ? sentMessage : msg)))

      // Update conversation list
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.id === currentChat.id) {
            return {
              ...conv,
              lastMessage: {
                text,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isRead: false,
                sender: "you",
              },
            }
          }
          return conv
        })
      })
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")

      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId))
    }
  }

  const markAsRead = (chatId: string) => {
    markMessagesAsRead(chatId)

    // Update UI to reflect read status
    setConversations((prev) => {
      return prev.map((conv) => {
        if (conv.id === chatId) {
          return {
            ...conv,
            unread: 0,
            lastMessage: {
              ...conv.lastMessage,
              isRead: true,
            },
          }
        }
        return conv
      })
    })
  }

  return (
    <MessageContext.Provider
      value={{
        conversations,
        setConversations,
        currentChat,
        setCurrentChat,
        messages,
        sendNewMessage,
        loading,
        error,
        markAsRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export const useMessages = () => {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessageProvider")
  }
  return context
}
