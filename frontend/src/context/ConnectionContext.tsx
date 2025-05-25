"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"

const API_URL = "http://localhost:5000/api"

interface Connection {
  _id: string
  userId: string
  name: string
  avatar?: string
  status: "connected" | "pending" | "none"
}

interface ConnectionContextType {
  connections: Connection[]
  pendingRequests: Connection[]
  loading: boolean
  error: string | null
  sendRequest: (userId: string) => Promise<void>
  acceptRequest: (requestId: string) => Promise<void>
  declineRequest: (requestId: string) => Promise<void>
  isConnected: (userId: string) => boolean
  hasPendingRequest: (userId: string) => boolean
  refreshConnections: () => Promise<void>
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connections, setConnections] = useState<Connection[]>([])
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConnections = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await axios.get(`${API_URL}/connections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setConnections(response.data.connections || [])
      setPendingRequests(response.data.pendingRequests || [])
    } catch (err: any) {
      console.error("Error fetching connections:", err)
      setError(err.response?.data?.message || "Failed to load connections")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  const sendRequest = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      await axios.post(
        `${API_URL}/connections/request/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Refresh connections after sending request
      await fetchConnections()
    } catch (err: any) {
      console.error("Error sending connection request:", err)
      setError(err.response?.data?.message || "Failed to send connection request")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const acceptRequest = async (requestId: string) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      await axios.post(
        `${API_URL}/connections/accept/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Refresh connections after accepting request
      await fetchConnections()
    } catch (err: any) {
      console.error("Error accepting connection request:", err)
      setError(err.response?.data?.message || "Failed to accept connection request")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const declineRequest = async (requestId: string) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      await axios.post(
        `${API_URL}/connections/decline/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Refresh connections after declining request
      await fetchConnections()
    } catch (err: any) {
      console.error("Error declining connection request:", err)
      setError(err.response?.data?.message || "Failed to decline connection request")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const isConnected = (userId: string) => {
    return connections.some((conn) => conn.userId === userId)
  }

  const hasPendingRequest = (userId: string) => {
    return pendingRequests.some((req) => req.userId === userId)
  }

  const refreshConnections = fetchConnections

  return (
    <ConnectionContext.Provider
      value={{
        connections,
        pendingRequests,
        loading,
        error,
        sendRequest,
        acceptRequest,
        declineRequest,
        isConnected,
        hasPendingRequest,
        refreshConnections,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

export const useConnection = () => {
  const context = useContext(ConnectionContext)
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider")
  }
  return context
}
