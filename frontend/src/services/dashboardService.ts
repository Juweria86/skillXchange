// Updated dashboard service to match your backend
const API_BASE_URL = "http://localhost:5000/api"

export const getUserStats = async () => {
  try {
    // Get auth token from localStorage or cookies
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

    console.log("Auth token found:", !!token)

    if (!token) {
      throw new Error("No authentication token found. Please log in.")
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }

    console.log("Making API request to:", `${API_BASE_URL}/users/stats`)

    const response = await fetch(`${API_BASE_URL}/users/stats`, {
      method: "GET",
      headers,
    })

    console.log("API Response status:", response.status)

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Authentication failed")
        localStorage.removeItem("authToken")
        sessionStorage.removeItem("authToken")
        throw new Error("Authentication failed. Please log in again.")
      }
      if (response.status === 404) {
        throw new Error("Dashboard API endpoint not found.")
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    console.log("API Response:", result)

    if (!result.success) {
      throw new Error(result.message || "API request failed")
    }

    return result // Return the full result object since your backend wraps data in { success: true, data: {...} }
  } catch (error) {
    console.error("Dashboard service error:", error)
    throw error // Don't fall back to mock data, let the component handle the error
  }
}

// Fetch user sessions
export const getUserSessions = async () => {
  try {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1]

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const sessions = await response.json()
    return sessions
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return []
  }
}

// Fetch skill matches
export const getSkillMatches = async () => {
  try {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1]

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_BASE_URL}/skills/ai-match`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.matches || []
  } catch (error) {
    console.error("Error fetching skill matches:", error)
    return []
  }
}

// Fetch announcements
export const getAnnouncements = async () => {
  try {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1]

    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${API_BASE_URL}/discussions/announcements`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const announcements = await response.json()
    return announcements
  } catch (error) {
    console.error("Error fetching announcements:", error)
    return []
  }
}
