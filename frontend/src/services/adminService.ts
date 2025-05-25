import api from "./api"

// Dashboard statistics
export const getAdminStats = async () => {
  const response = await api.get("/admin/stats")
  return response.data
}

// User management
export const getUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params })
  return response.data
}

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`)
  return response.data
}

export const updateUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData)
  return response.data
}

export const deleteUser = async (id) => {
  // Add validation
  if (!id) {
    throw new Error("User ID is required")
  }
  
  try {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  } catch (error) {
    // Add more detailed error handling
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete user')
    } else {
      throw new Error('Network error or server unavailable')
    }
  }
}

// Discussion management
export const getDiscussions = async (params = {}) => {
  const response = await api.get("/admin/discussions", { params })
  return response.data
}

export const updateDiscussionStatus = async (id, status) => {
  const response = await api.patch(`/admin/discussions/${id}/status`, { status })
  return response.data
}

export const deleteDiscussion = async (id) => {
  const response = await api.delete(`/admin/discussions/${id}`)
  return response.data
}

// Resource management
export const getResources = async (params = {}) => {
  const response = await api.get("/admin/resources", { params })
  return response.data
}

export const approveResource = async (id, isApproved) => {
  const response = await api.patch(`/admin/resources/${id}/approve`, { isApproved })
  return response.data
}

export const deleteResource = async (id) => {
  const response = await api.delete(`/admin/resources/${id}`)
  return response.data
}

// Challenge management
export const getChallenges = async (params = {}) => {
  const response = await api.get("/admin/challenges", { params })
  return response.data
}

export const createChallenge = async (challengeData) => {
  // Ensure required fields are present
  if (!challengeData.title || !challengeData.startDate || !challengeData.endDate) {
    throw new Error("Title, start date, and end date are required");
  }
  const response = await api.post("/admin/challenges", challengeData)
  return response.data
}

export const updateChallenge = async (id, challengeData) => {
  const response = await api.put(`/admin/challenges/${id}`, challengeData)
  return response.data
}

export const deleteChallenge = async (id) => {
  const response = await api.delete(`/admin/challenges/${id}`)
  return response.data
}

// Announcement management
export const getAnnouncements = async () => {
  const response = await api.get("/admin/announcements")
  return response.data
}

export const createAnnouncement = async (announcementData) => {
  const response = await api.post("/admin/announcements", announcementData)
  return response.data
}

export const updateAnnouncement = async (id, announcementData) => {
  const response = await api.put(`/admin/announcements/${id}`, announcementData)
  return response.data
}

export const deleteAnnouncement = async (id) => {
  const response = await api.delete(`/admin/announcements/${id}`)
  return response.data
}

// Report management
export const getReports = async (params = {}) => {
  const response = await api.get("/admin/reports", { params })
  return response.data
}

export const updateReportStatus = async (id, status) => {
  const response = await api.patch(`/admin/reports/${id}/status`, { status })
  return response.data
}

// Settings management
export const getSettings = async () => {
  const response = await api.get("/admin/settings")
  return response.data
}

export const updateSettings = async (settings) => {
  const response = await api.put("/admin/settings", { settings })
  return response.data
}
