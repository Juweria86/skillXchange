import axios from "axios"
import type { Message } from "../types/message"

const API_URL = "http://localhost:5000/api"

// Create axios instance with auth header
const createAuthHeader = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// Get messages for a specific conversation
export const getMessages = async (receiverId: string, token: string): Promise<Message[]> => {
  try {
    const response = await axios.get(`${API_URL}/messages/${receiverId}`, createAuthHeader(token))
    return response.data
  } catch (error) {
    console.error("Error fetching messages:", error)
    throw error
  }
}

// Send a message
export const sendMessage = async (receiverId: string, text: string, token: string): Promise<Message> => {
  try {
    const response = await axios.post(`${API_URL}/messages/${receiverId}`, { text }, createAuthHeader(token))
    return response.data
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// Get all conversations/chats
export const getConversations = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/messages`, createAuthHeader(token))
    return response.data
  } catch (error) {
    console.error("Error fetching conversations:", error)
    throw error
  }
}
