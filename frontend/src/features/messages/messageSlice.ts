import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMessages, postMessage } from "./messageAPI";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  timestamp: string;
}

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

// Thunks
export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (receiverId: string) => {
    return await fetchMessages(receiverId);
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ receiverId, text }: { receiverId: string; text: string }) => {
    return await postMessage(receiverId, text);
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
