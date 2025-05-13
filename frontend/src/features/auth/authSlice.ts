import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginUserAPI, registerUserAPI } from "./authAPI";

const token = localStorage.getItem("token");

const initialState = {
  user: null as any,
  token: token || null,
  loading: false,
  error: null as string | null,
};

type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: AuthPayload, { rejectWithValue }) => {
    try {
      const response = await registerUserAPI(userData);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message); // 💥 grab the error message thrown above
    }
  }
);



export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: Omit<AuthPayload, "name">) => {
    const response = await loginUserAPI(userData); // returns { user, token }
    return response; // 🔁 ensure it returns both
  }
);

// authSlice.ts
export const completeOnboarding = createAsyncThunk(
  "auth/completeOnboarding",
  async (formData: FormData, { getState }) => {
    const token = (getState() as any).auth.token;
    const res = await fetch("http://localhost:5000/api/users/onboarding", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error("Onboarding failed");
    }
    
    return await res.json();
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // comes from rejectWithValue
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload.user,
          isOnboarded: true
        };
      });
  },
});

export const { logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
