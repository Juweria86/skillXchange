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
  async (userData: AuthPayload) => {
    return await registerUserAPI(userData);
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: Omit<AuthPayload, "name">) => {
    return await loginUserAPI(userData);
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
        state.error = action.error.message || null;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
