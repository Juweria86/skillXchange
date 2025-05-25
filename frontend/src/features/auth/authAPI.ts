const BASE_URL = "http://localhost:5000/api/auth"

export async function registerUserAPI(data: {
  name: string
  email: string
  password: string
  adminSecretKey?: string
}) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const json = await res.json() // Parse response JSON either way

  if (!res.ok) {
    // Throw the actual error message from backend
    throw new Error(json.message || "Registration failed")
  }

  return json
}

// authAPI.ts
export async function loginUserAPI(data: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const userData = await res.json()

  if (!res.ok) {
    throw new Error(userData.message || "Login failed")
  }

  // Ensure the response includes isOnboarded, role, and _id for consistency
  return {
    token: userData.token,
    user: {
      ...userData.user,
      _id: userData.user._id || userData.user.id, // <-- always provide _id
      isOnboarded: userData.user.isOnboarded || false, // Default to false if not provided
      role: userData.user.role || "user", // Default to 'user' if not provided
    },
  }
}

// Add a new function to create admin users
export async function createAdminAPI(data: {
  name: string
  email: string
  password: string
  adminSecretKey: string
}) {
  const res = await fetch(`${BASE_URL}/create-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || "Admin creation failed")
  }

  return json
}

// Add a function to promote a user to admin
export async function promoteToAdminAPI(
  data: {
    userId: string
    adminSecretKey: string
  },
  token: string,
) {
  const res = await fetch(`${BASE_URL}/promote-to-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.message || "Admin promotion failed")
  }

  return json
}
