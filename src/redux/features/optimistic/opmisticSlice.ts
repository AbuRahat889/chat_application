import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  isMultiSelectActive: false,
  files: '',
  name: "",
  department: "",
  messageId: null,
  message: "",
  createdAt: new Date().toISOString(),
  isSender: false,
  avatar: "",
  replyMsgId: null,
  isStreamingStatus: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Set the chat values
    setChatValues: (state, action) => {
      return { ...state, ...action.payload };
    },
    // Clear the chat values
    clearChatValues: () => initialState,
  },
});

export const { setChatValues, clearChatValues } = chatSlice.actions;

export default chatSlice.reducer;
