"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-hot-toast"

interface Connection {
  _id: string
  user: {
    _id: string
    name: string
    profileImage?: string
  }
  createdAt: string
  message?: string
}

interface ConnectionsData {
  accepted: Connection[]
  pending: {
    sent: Connection[]
    received: Connection[]
  }
}

export function useConnectionStatus() {
  const [connections, setConnections] = useState<ConnectionsData>({
    accepted: [],
    pending: {
      sent: [],
      received: [],
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all connections
  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("http://localhost:5000/api/connections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch connections")
      }

      const data = await response.json()
      setConnections(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching connections:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  // Check connection status with a specific user
  const checkConnectionStatus = useCallback(
    (userId: string) => {
      // Check if already connected
      const isConnected = connections.accepted.some((conn) => conn.user._id === userId)

      // Check if there's a pending request sent by the current user
      const sentRequest = connections.pending.sent.find((conn) => conn.user._id === userId)
      const isPending = !!sentRequest

      // Check if there's a pending request received from this user
      const receivedRequest = connections.pending.received.find((conn) => conn.user._id === userId)
      const isReceived = !!receivedRequest

      return {
        isConnected,
        isPending,
        isReceived,
        connectionId: sentRequest?._id || receivedRequest?._id || null,
      }
    },
    [connections],
  )

  // Send a connection request
  const sendConnectionRequest = useCallback(
    async (userId: string) => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`http://localhost:5000/api/connections/request/${userId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to send connection request")
        }

        // Refresh connections
        await fetchConnections()
      } catch (err) {
        console.error("Error sending connection request:", err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchConnections],
  )

  // Accept a connection request
  const acceptConnectionRequest = useCallback(
    async (requestId: string) => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`http://localhost:5000/api/connections/accept/${requestId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to accept connection request")
        }

        // Refresh connections
        await fetchConnections()
      } catch (err) {
        console.error("Error accepting connection request:", err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchConnections],
  )

  // Decline a connection request
  const declineConnectionRequest = useCallback(
    async (requestId: string) => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`http://localhost:5000/api/connections/decline/${requestId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to decline connection request")
        }

        // Refresh connections
        await fetchConnections()
      } catch (err) {
        console.error("Error declining connection request:", err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchConnections],
  )

  // Remove a connection
  const removeConnection = useCallback(
    async (connectionId: string) => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`http://localhost:5000/api/connections/${connectionId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to remove connection")
        }

        // Refresh connections
        await fetchConnections()
        toast.success("Connection removed successfully")
      } catch (err) {
        console.error("Error removing connection:", err)
        toast.error(err instanceof Error ? err.message : "Failed to remove connection")
      } finally {
        setLoading(false)
      }
    },
    [fetchConnections],
  )

  return {
    connections,
    loading,
    error,
    checkConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection,
    refreshConnections: fetchConnections,
  }
}
