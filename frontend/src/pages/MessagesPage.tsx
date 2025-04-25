"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Check, CheckCheck, Paperclip, ImageIcon, Smile, Send, Calendar } from "lucide-react"
import AppSidebar from "../components/AppSidebar"
import PageHeader from "../components/layout/PageHeader"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Avatar from "../components/ui/Avatar"

// Chat list item component
function ChatListItem({ chat, isActive, onClick }: { chat: any; isActive: boolean; onClick: () => void }) {
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

// Message bubble component
function MessageBubble({ message }: { message: any }) {
  return (
    <div className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-lg p-3 ${
          message.sender === "you"
            ? "bg-[#4a3630] text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
        }`}
      >
        <p>{message.text}</p>
        <div
          className={`text-xs mt-1 flex items-center justify-end gap-1 ${
            message.sender === "you" ? "text-gray-300" : "text-gray-500"
          }`}
        >
          <span>{message.time}</span>
          {message.sender === "you" && (
            <>
              {message.status === "sent" && <Check size={12} />}
              {message.status === "delivered" && <Check size={12} />}
              {message.status === "read" && <CheckCheck size={12} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Sample data for chats
  const chats = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=48&width=48",
        online: true,
      },
      lastMessage: {
        text: "Looking forward to our Python session tomorrow!",
        time: "10:23 AM",
        isRead: true,
        sender: "them",
      },
      unread: 0,
    },
    {
      id: 2,
      user: {
        name: "James Wilson",
        avatar: "/placeholder.svg?height=48&width=48",
        online: false,
      },
      lastMessage: {
        text: "Thanks for the web design tips. They were really helpful!",
        time: "Yesterday",
        isRead: false,
        sender: "them",
      },
      unread: 2,
    },
    {
      id: 3,
      user: {
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=48&width=48",
        online: true,
      },
      lastMessage: {
        text: "I'd like to learn more about UX design. When are you available?",
        time: "Yesterday",
        isRead: true,
        sender: "them",
      },
      unread: 0,
    },
  ]

  // Sample conversation data
  const conversations = {
    1: [
      {
        id: 1,
        text: "Hi Sarah! I'm looking forward to our Python session tomorrow.",
        time: "10:15 AM",
        sender: "you",
        status: "read",
      },
      {
        id: 2,
        text: "Looking forward to our Python session tomorrow!",
        time: "10:23 AM",
        sender: "them",
        status: "read",
      },
      {
        id: 3,
        text: "Should I prepare anything specific for the session?",
        time: "10:24 AM",
        sender: "them",
        status: "read",
      },
      {
        id: 4,
        text: "Just bring your laptop with Python installed. We'll start with the basics and work our way up.",
        time: "10:30 AM",
        sender: "you",
        status: "read",
      },
      {
        id: 5,
        text: "Perfect! I have Python 3.9 installed. See you tomorrow at 10 AM.",
        time: "10:35 AM",
        sender: "them",
        status: "read",
      },
    ],
    2: [
      {
        id: 1,
        text: "Hey James, how did the web design project go?",
        time: "Yesterday, 3:45 PM",
        sender: "you",
        status: "read",
      },
      {
        id: 2,
        text: "It went really well! I used the layout techniques you taught me.",
        time: "Yesterday, 4:20 PM",
        sender: "them",
        status: "read",
      },
      {
        id: 3,
        text: "Thanks for the web design tips. They were really helpful!",
        time: "Yesterday, 4:22 PM",
        sender: "them",
        status: "delivered",
      },
      {
        id: 4,
        text: "Do you have time for another session next week?",
        time: "Yesterday, 4:23 PM",
        sender: "them",
        status: "delivered",
      },
    ],
  }

  // Set default selected chat
  useEffect(() => {
    if (chats.length > 0 && !selectedChat) {
      setSelectedChat(chats[0])
    }
  }, [chats, selectedChat])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedChat])

  const handleSendMessage = () => {
    if (message.trim() === "") return

    // In a real app, you would send this to your backend
    console.log("Message sent:", message)
    setMessage("")
  }

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <PageHeader title="Messages" backTo="/home-dashboard" />

        <div className="flex-1 flex flex-col md:flex-row">
          {/* Chat List */}
          <div className="w-full md:w-80 bg-white border-r border-gray-200 md:h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-4">
              <div className="relative mb-4">
                <Input type="text" placeholder="Search messages..." variant="yellow" leftIcon={<Search size={16} />} />
              </div>

              <div className="space-y-1">
                {chats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isActive={selectedChat && selectedChat.id === chat.id}
                    onClick={() => setSelectedChat(chat)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          {selectedChat ? (
            <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
              {/* Chat Header */}
              <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar src={selectedChat.user.avatar} size="md" fallback={selectedChat.user.name} />
                    {selectedChat.user.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">{selectedChat.user.name}</h2>
                    <p className="text-xs text-gray-500">
                      {selectedChat.user.online ? "Online" : "Last seen recently"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {conversations[selectedChat.id]?.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
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
                    disabled={message.trim() === ""}
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
          )}
        </div>
      </div>
    </div>
  )
}
