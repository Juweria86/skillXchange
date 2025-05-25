"use client"

import { useState } from "react"
import axios from "axios"

const API_URL = "http://localhost:5000/api"

export function useConnection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to send a connection request
  const sendConnectionRequest = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await axios.post(
        `${API_URL}/connections/request/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send connection request")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Function to accept a connection request
  const acceptConnectionRequest = async (requestId: string) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await axios.post(
        `${API_URL}/connections/accept/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to accept connection request")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Function to decline a connection request
  const declineConnectionRequest = async (requestId: string) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await axios.post(
        `${API_URL}/connections/decline/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to decline connection request")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Function to check if users are connected
  const checkConnection = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await axios.get(`${API_URL}/connections/status/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to check connection status")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    checkConnection,
  }
}
