"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, Paperclip, ImageIcon, Smile, Send, Calendar, ChevronLeft } from "lucide-react"
import AppSidebar from "../components/AppSidebar"
import { useMessages } from "../context/MessageContext"
import { formatDistanceToNow } from "date-fns"
import Avatar from "../components/ui/Avatar"
import MessageBubble from "../components/messages/MessageBubble"
import { useSelector } from "react-redux"

// Chat list item component
function ChatListItem({ chat, isActive, onClick }) {
  return (
    <button
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
        isActive ? "bg-[#FBEAA0]" : "hover:bg-gray-100 focus:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar src={chat.user.avatar} size="md" fallback={chat.user.name} />
        {chat.user.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900 truncate">{chat.user.name}</h3>
          <span className="text-xs text-gray-500">{chat.lastMessage.time}</span>
        </div>
        <p className={`text-sm truncate ${chat.unread > 0 ? "font-medium text-gray-900" : "text-gray-500"}`}>
          {chat.lastMessage.sender === "you" ? "You: " : ""}
          {chat.lastMessage.text}
        </p>
      </div>
      {chat.unread > 0 && (
        <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
          {chat.unread}
        </div>
      )}
    </button>
  )
}

// Empty state component
function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-[#FBEAA0] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#4a3630]"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
        <p className="text-gray-600">Choose a conversation from the list to start chatting</p>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const { conversations, setConversations, currentChat, setCurrentChat, messages, sendNewMessage, loading, error } =
    useMessages()
  const location = useLocation()

  const [message, setMessage] = useState("")
  const messagesEndRef = useRef(null)
  const userIdFromRedux = useSelector((state) => state.auth.user?.id)
  let userId = userIdFromRedux
  if (!userId) {
    userId = localStorage.getItem("userId")
    if (!userId) {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          userId = JSON.parse(userStr)._id
        } catch {}
      }
    }
  }

  console.log("Redux userId:", userIdFromRedux)
  console.log("LocalStorage userId:", localStorage.getItem("userId"))
  console.log("LocalStorage user:", localStorage.getItem("user"))

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const userIdParam = params.get("userId")
    if (userIdParam) {
      // Try to find the conversation with this userId
      let found = conversations.find(
        (conv) => conv.user && (conv.user._id === userIdParam || conv.user.id === userIdParam)
      )
      if (found) {
        setCurrentChat(found)
      } else {
        // Try to get user info from localStorage user directory or matches
        let userObj = null
        try {
          // Try to get user info from previous conversations
          const users = conversations.map((c) => c.user)
          userObj = users.find((u) => u._id === userIdParam || u.id === userIdParam)
          // Try to get from a user directory in localStorage (e.g., "users" array)
          if (!userObj) {
            const usersStr = localStorage.getItem("users")
            if (usersStr) {
              const usersArr = JSON.parse(usersStr)
              userObj = usersArr.find((u) => u._id === userIdParam || u.id === userIdParam)
            }
          }
          // Try to get from last viewed match (if you store it)
          if (!userObj) {
            const lastMatchStr = localStorage.getItem("lastViewedMatch")
            if (lastMatchStr) {
              const match = JSON.parse(lastMatchStr)
              if (match.id === userIdParam || match._id === userIdParam) {
                userObj = {
                  _id: match.id || match._id,
                  name: match.name,
                  avatar: match.avatar,
                  online: match.active || false,
                }
              }
            }
          }
        } catch {}
        // If you have no userObj, fallback to minimal info
        const tempConv = {
          id: userIdParam,
          user: userObj || { _id: userIdParam, name: "User", avatar: "", online: false },
          lastMessage: { text: "", time: "", isRead: true, sender: "" },
          unread: 0,
        }
        setConversations((prev) => {
          if (prev.some((c) => c.id === userIdParam)) return prev
          return [...prev, tempConv]
        })
        setCurrentChat(tempConv)
      }
    }
  }, [location.search, conversations, setConversations, setCurrentChat])

  const handleSendMessage = () => {
    if (message.trim() === "") return

    sendNewMessage(message)
    setMessage("")
  }

  // Format relative time (e.g., "2 hours ago", "yesterday")
  const formatRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        {/* Back Button - Mobile Only */}
        <div className="p-4 bg-white shadow-sm lg:hidden">
          <Link
            to="/home-dashboard"
            className="inline-flex items-center text-[#4a3630] hover:text-[#3a2a24] font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex-1 flex flex-col md:flex-row">
          {/* Chat List */}
          <div className="w-full md:w-80 bg-white border-r border-gray-200 md:h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0]"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
              </div>

              <div className="space-y-1">
                {conversations.length > 0 ? (
                  conversations.map((chat) => (
                    <ChatListItem
                      key={chat.id}
                      chat={chat}
                      isActive={currentChat && currentChat.id === chat.id}
                      onClick={() => setCurrentChat(chat)}
                    />
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">No conversations yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          {currentChat ? (
            <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar src={currentChat.user.avatar} size="md" fallback={currentChat.user.name} />
                    {currentChat.user.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">{currentChat.user.name}</h2>
                    <p className="text-xs text-gray-500">{currentChat.user.online ? "Online" : "Last seen recently"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/profile/${currentChat.id}`}
                    className="px-3 py-1 text-sm text-[#4a3630] border border-[#4a3630] rounded-lg hover:bg-[#FBEAA0]"
                  >
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4a3630]"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-6 text-red-500">{error}</div>
                ) : (
                  <div className="space-y-4">
                    {messages.length > 0 ? (
                      messages.map((msg) => (
                        <MessageBubble key={msg._id} message={msg} currentUserId={userId} />
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">No messages yet. Start the conversation!</div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="bg-white p-3 border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Paperclip size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <ImageIcon size={20} />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      placeholder="Type a message..."
                      className="w-full pl-3 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4a3630] bg-[#FBEAA0] resize-none"
                      rows={1}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    ></textarea>
                    <button className="absolute right-2 bottom-2 p-1 text-gray-500 hover:text-gray-700 rounded-full">
                      <Smile size={20} />
                    </button>
                  </div>
                  <button
                    className="p-2 bg-[#4a3630] text-white rounded-full hover:bg-[#3a2a24] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={message.trim() === "" || loading}
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="mt-2 flex justify-center">
                  <button className="flex items-center gap-1 px-3 py-1 text-xs text-[#4a3630] bg-[#FBEAA0] rounded-full hover:bg-[#F5D76E]">
                    <Calendar size={12} />
                    <span>Propose a time to meet</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}
