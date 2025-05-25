import axios from "axios"

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData)
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },
}

// Discussion services
export const discussionService = {
  getDiscussions: async (params = {}) => {
    const response = await api.get("/discussions", { params })
    return response.data
  },

  getAnnouncements: async () => {
    const response = await api.get("/discussions/announcements")
    return response.data
  },

  getDiscussion: async (id) => {
    const response = await api.get(`/discussions/${id}`)
    return response.data
  },

  createDiscussion: async (discussionData) => {
    const response = await api.post("/discussions", discussionData)
    return response.data
  },

  addReply: async (discussionId, content) => {
    const response = await api.post(`/discussions/${discussionId}/replies`, { content })
    return response.data
  },

  likeDiscussion: async (discussionId) => {
    const response = await api.post(`/discussions/${discussionId}/like`)
    return response.data
  },
}

// Resource services
export const resourceService = {
  getResources: async (params = {}) => {
    const response = await api.get("/resources", { params })
    return response.data
  },

  getResource: async (id) => {
    const response = await api.get(`/resources/${id}`)
    return response.data
  },

  createResource: async (resourceData) => {
    // If resourceData contains a file, use FormData
    if (resourceData.file) {
      const formData = new FormData()
      Object.keys(resourceData).forEach((key) => {
        if (key === "file") {
          formData.append("file", resourceData.file)
        } else {
          formData.append(key, resourceData[key])
        }
      })

      const response = await api.post("/resources", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    }

    // Otherwise, send as JSON
    const response = await api.post("/resources", resourceData)
    return response.data
  },

  downloadResource: async (id) => {
    window.open(`${api.defaults.baseURL}/resources/${id}/download`, "_blank")
  },
}

// Challenge services
export const challengeService = {
  getChallenges: async () => {
    const response = await api.get("/challenges")
    return response.data
  },

  getChallenge: async (id) => {
    const response = await api.get(`/challenges/${id}`)
    return response.data
  },

  joinChallenge: async (id) => {
    const response = await api.post(`/challenges/${id}/join`)
    return response.data
  },

  getChallengeProgress: async (id) => {
    const response = await api.get(`/challenges/${id}/progress`)
    return response.data
  },

  getChallengeLeaderboard: async (id) => {
    const response = await api.get(`/challenges/${id}/leaderboard`)
    return response.data
  },
}

export default api
