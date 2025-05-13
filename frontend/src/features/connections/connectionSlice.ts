import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchConnections } from "./connectionAPI";

interface Connection {
  _id: string;
  name: string;
  avatar?: string;
  online?: boolean;
}

interface ConnectionState {
  connections: Connection[];
}

const initialState: ConnectionState = {
  connections: [],
};

export const getConnections = createAsyncThunk(
  "connections/getConnections",
  async () => {
    return await fetchConnections();
  }
);

const connectionSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    setConnections: (state, action: PayloadAction<Connection[]>) => {
      state.connections = action.payload;
    },
    updateConnectionStatus: (
      state,
      action: PayloadAction<{ id: string; online: boolean }>
    ) => {
      const conn = state.connections.find(c => c._id === action.payload.id);
      if (conn) conn.online = action.payload.online;
    },
  },
  extraReducers: builder => {
    builder.addCase(getConnections.fulfilled, (state, action) => {
      state.connections = action.payload;
    });
  },
});

export const { setConnections, updateConnectionStatus } = connectionSlice.actions;
export default connectionSlice.reducer;
