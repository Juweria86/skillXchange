import axios from "axios"
import type { Chat } from "../types/message"

const API_URL = "http://localhost:5000/api"

// Create axios instance with auth header
const createAuthHeader = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// Get all conversations for the current user
export const getConversations = async (token: string): Promise<Chat[]> => {
  try {
    const response = await axios.get(`${API_URL}/messages`, createAuthHeader(token))

    // Transform the API response to match our Chat interface
    return response.data.map((conv: any) => ({
      id: conv._id,
      user: {
        _id: conv.participant._id,
        name: conv.participant.name,
        avatar: conv.participant.profileImage,
        online: conv.participant.online || false,
      },
      lastMessage: {
        text: conv.lastMessage?.text || "Start a conversation",
        time: conv.lastMessage?.createdAt
          ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "",
        isRead: conv.lastMessage?.isRead || true,
        sender: conv.lastMessage?.sender === conv.participant._id ? "them" : "you",
      },
      unread: conv.unreadCount || 0,
    }))
  } catch (error) {
    console.error("Error fetching conversations:", error)
    throw error
  }
}
