import { createSlice } from "@reduxjs/toolkit";

const editorSlice = createSlice({
  name: "editor",
  initialState: {
    content: "",
  },
  reducers: {
    setContent: (state, action) => {
      state.content = action.payload;
    },
    clearContent: (state) => {
      state.content = ""; // Clear the editor content
    },
  },
});

export const { setContent, clearContent } = editorSlice.actions;

export default editorSlice.reducer;
