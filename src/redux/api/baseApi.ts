// src/features/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const baseApi = createApi({
  reducerPath: "baseApi", // The key for this API in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl: "https://app.boom360trader.com/api/v1", // Replace with your API's base URL
    // credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies?.get("accessToken"); // Assuming token is stored in the auth slice
      if (token) {
        headers.set("Authorization", `${token}`);
        return;
      }
      // return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "Group",
    "Chanel",
    "ChannelFiles",
    "ChannelMembers",
    "ADMIN",
    "chat",
  ],
});

// Export hooks for usage in functional components
export default baseApi;
