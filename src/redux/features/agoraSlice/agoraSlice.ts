import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: null,
  channelName: null,
  agoraToken: null,
  appId: null,
  channelId: null,
};

export const agoraSlice = createSlice({
  name: "agoraSlice",
  initialState,
  reducers: {
    setAppInfo: (state, action) => {
      const { uid, channelName, token, appId, channelId } = action.payload;
      state.uid = uid;
      state.channelName = channelName;
      state.agoraToken = token;
      state.appId = appId;
      state.channelId = channelId;
    },
    clearAppInfo: (state) => {
      state.uid = null;
      state.channelName = null;
      state.agoraToken = null;
      state.appId = null;
      state.channelId = null;
    },
  },
});

export const { setAppInfo, clearAppInfo } = agoraSlice.actions;

export default agoraSlice.reducer;
