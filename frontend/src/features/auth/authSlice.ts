import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { loginUserAPI, registerUserAPI, createAdminAPI, promoteToAdminAPI } from "./authAPI"

const token = localStorage.getItem("token")
const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null

// Define a proper type for the user
interface User {
  _id: string
  name: string
  email: string
  isOnboarded?: boolean
  role?: string
  [key: string]: any // For other properties
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  isHydrated: boolean
}

const initialState: AuthState = {
  user: storedUser,
  token: token || null,
  loading: false,
  error: null,
  isHydrated: false,
}

type AuthPayload = {
  name?: string
  email: string
  password: string
  adminSecretKey?: string
}

export const registerUser = createAsyncThunk("auth/register", async (userData: AuthPayload, { rejectWithValue }) => {
  try {
    const response = await registerUserAPI(userData)
    return response
  } catch (err: any) {
    return rejectWithValue(err.message)
  }
})

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: Omit<AuthPayload, "name">, { rejectWithValue }) => {
    try {
      const response = await loginUserAPI(userData)
      return response
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  },
)

export const createAdmin = createAsyncThunk(
  "auth/createAdmin",
  async (userData: AuthPayload & { adminSecretKey: string }, { rejectWithValue }) => {
    try {
      const response = await createAdminAPI(userData)
      return response
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  },
)

export const promoteToAdmin = createAsyncThunk(
  "auth/promoteToAdmin",
  async (data: { userId: string; adminSecretKey: string }, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token
      const response = await promoteToAdminAPI(data, token)
      return response
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  },
)

// authSlice.ts
export const completeOnboarding = createAsyncThunk(
  "auth/completeOnboarding",
  async (formData: FormData, { getState }) => {
    const token = (getState() as any).auth.token
    const res = await fetch("http://localhost:5000/api/users/onboarding", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!res.ok) {
      throw new Error("Onboarding failed")
    }

    return await res.json()
  },
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("userId")
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem("token", action.payload)
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      localStorage.setItem("user", JSON.stringify(action.payload))
    },
    setHydrated: (state) => {
  state.isHydrated = true;
},

  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        localStorage.setItem("token", action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
.addCase(loginUser.fulfilled, (state, action) => {
  state.loading = false
  state.token = action.payload.token
  state.user = {
    ...action.payload.user,
    role: action.payload.user.role || "user", // Default fallback
  }
  if (state.user._id && !state.user.id) {
    state.user.id = state.user._id
  }
  localStorage.setItem("token", action.payload.token)
  localStorage.setItem("userId", state.user._id || state.user.id)
  localStorage.setItem("user", JSON.stringify(state.user))
})

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || action.error.message || null
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload.user,
          isOnboarded: true,
        }
        localStorage.setItem("user", JSON.stringify(state.user))
      })
      .addCase(createAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.token) {
          state.token = action.payload.token
          state.user = action.payload.user
          if (action.payload.user._id && !action.payload.user.id) {
            state.user.id = action.payload.user._id
          }
          localStorage.setItem("token", action.payload.token)
          localStorage.setItem("userId", action.payload.user._id || action.payload.user.id)
          localStorage.setItem("user", JSON.stringify(state.user))
        }
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(promoteToAdmin.fulfilled, (state, action) => {
        state.loading = false
        if (state.user && (state.user._id === action.payload.user._id || state.user.id === action.payload.user._id)) {
          state.user = {
            ...state.user,
            role: "admin",
          }
          localStorage.setItem("user", JSON.stringify(state.user))
        }
      })
  },
})

export const { logout, setToken, setUser, setHydrated } = authSlice.actions
export default authSlice.reducer
