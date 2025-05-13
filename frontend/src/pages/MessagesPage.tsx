"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../hooks/useTypedHooks";
import { useUserById } from "../hooks/useUserById";
import { getMessages, sendMessage, addMessage } from "../features/messages/messageSlice";
import { useSocket } from "../context/SocketContext";
import { Search, Paperclip, ImageIcon, Smile, Send, Calendar, CheckCheck } from "lucide-react";
import AppSidebar from "../components/AppSidebar";
import PageHeader from "../components/layout/PageHeader";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";

function ChatListItem({ chat, isActive, onClick }) {
  return (
    <button
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${isActive ? "bg-[#FBEAA0]" : "hover:bg-gray-100"}`}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar src={chat.avatar} size="md" fallback={chat.name} />
        {chat.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
        <p className="text-sm text-gray-500 truncate">Last message</p>
      </div>
    </button>
  );
}

function MessageBubble({ message, currentUserId }) {
  const isSender = (message.sender?._id || message.sender) === currentUserId;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-lg p-3 ${
          isSender ? "bg-[#4a3630] text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none shadow-sm"
        }`}
      >
        <p>{message.text}</p>
        <div
          className={`text-xs mt-1 flex items-center justify-end gap-1 ${
            isSender ? "text-gray-300" : "text-gray-500"
          }`}
        >
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
          {isSender && <CheckCheck size={12} />}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.messages);

  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get("user");
  const { user: selectedUser } = useUserById(selectedUserId);

  useEffect(() => {
    if (selectedUser) {
      setSelectedChat(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedChat?._id) return;
    socket.emit("join_room", selectedChat._id);
    dispatch(getMessages(selectedChat._id));
  }, [selectedChat, dispatch, socket]);

  useEffect(() => {
    if (!socket || !selectedChat?._id) return;

    const handleReceive = (msg) => {
      if (
        (msg.sender === user._id && msg.receiver === selectedChat._id) ||
        (msg.receiver === user._id && msg.sender === selectedChat._id)
      ) {
        dispatch(addMessage(msg));
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [socket, selectedChat, user._id, dispatch]);

  const handleSendMessage = () => {
    if (!selectedChat?._id || !message.trim()) return;

    dispatch(sendMessage({ receiverId: selectedChat._id, text: message }));
    socket.emit("send_message", {
      text: message,
      sender: user._id,
      receiver: selectedChat._id,
      room: selectedChat._id,
    });
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-screen bg-[#FFF7D4]">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <PageHeader title="Messages" backTo="/home-dashboard" />
        <div className="flex-1 flex flex-col md:flex-row">
          <div className="w-full md:w-80 bg-white border-r border-gray-200 md:h-[calc(100vh-64px)] overflow-y-auto p-4">
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search messages..."
                variant="yellow"
                leftIcon={<Search size={16} />}
              />
            </div>
            {selectedUser && (
              <ChatListItem
                chat={selectedUser}
                isActive={selectedChat?._id === selectedUser._id}
                onClick={() => setSelectedChat(selectedUser)}
              />
            )}
          </div>

          {selectedChat ? (
            <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
              <div className="bg-white p-4 border-b border-gray-200 flex items-center gap-3">
                <div className="relative">
                  <Avatar src={selectedChat.avatar} size="md" fallback={selectedChat.name} />
                  {selectedChat.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h2 className="font-medium text-gray-900">{selectedChat.name}</h2>
                  <p className="text-xs text-gray-500">{selectedChat.online ? "Online" : "Offline"}</p>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <MessageBubble key={msg._id} message={msg} currentUserId={user._id} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

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
                          e.preventDefault();
                          handleSendMessage();
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
                    disabled={!message.trim()}
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
                <p className="text-gray-600">Choose a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
