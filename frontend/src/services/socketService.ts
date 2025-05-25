import { io, type Socket } from "socket.io-client"
import type { Message } from "../types/message"

const SOCKET_URL = "http://localhost:5000"

let socket: Socket | null = null

export const initializeSocket = (token: string) => {
  if (socket) return socket

  // Connect to the socket server with auth token
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  })

  socket.on("connect", () => {
    console.log("Connected to socket server")
  })

  socket.on("disconnect", () => {
    console.log("Disconnected from socket server")
  })

  socket.on("error", (error) => {
    console.error("Socket error:", error)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const subscribeToMessages = (callback: (message: Message) => void) => {
  if (!socket) return

  // Remove any previous listener to avoid duplicate events
  socket.off("newMessage")
  socket.on("newMessage", (message: Message) => {
    callback(message)
  })
}

// Optional: for cleanup if needed
export const unsubscribeFromMessages = () => {
  if (!socket) return
  socket.off("newMessage")
}

export const sendSocketMessage = (message: { receiverId: string; text: string }) => {
  if (!socket) return

  socket.emit("sendMessage", message)
}

export const markMessagesAsRead = (conversationId: string) => {
  if (!socket) return

  socket.emit("markAsRead", { conversationId })
}

export const subscribeToUserStatus = (callback: (data: { userId: string; online: boolean }) => void) => {
  if (!socket) return

  socket.on("userStatus", (data) => {
    callback(data)
  })
}
