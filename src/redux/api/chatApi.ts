import baseApi from "./baseApi";

const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //get all message
    createChat: build.mutation({
      query: ({ id, formData }) => ({
        url: `/message/send-message/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["chat", "Chanel", "Group"],
    }),

    //get single message  /message/678b6c9b207e8779fee25564
    getSingleMessage: build.query({
      query: (id) => ({
        url: `/message/${id}`,
        method: "GET",
      }),
    }),

    //multiple message from channel
    deleteMultipleMessage: build.mutation({
      query: (ids) => ({
        url: `/message/delete/multiple-messages`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["Group", "Chanel", "chat", "ChannelFiles", "ADMIN"],
    }),

    getSearchMessage: build.query({
      query: ({ id, search }) => ({
        url: `/message/search/messages/${id}?search=${search}`,
        method: "GET",
      }),
      providesTags: ["chat"],
    }),

    //create record of live streaming
    createRecord: build.mutation({
      query: ({ channel, uid }) => ({
        url: `/start-recording`,
        method: "POST",
        body: { channel, uid },
      }),
      invalidatesTags: ["chat", "Chanel", "Group", "Chanel"],
    }),
    //create record of live streaming
    stopRecord: build.mutation({
      query: ({ channel, uid, sid, resourceId, channelId }) => ({
        url: `/stop-recording`,
        method: "POST",
        body: { channel, uid, sid, resourceId, channelId },
      }),
      invalidatesTags: ["chat", "Chanel", "Group", "Chanel"],
    }),

    //get record of live streaming
    getRecord: build.query({
      query: (id) => ({
        url: `/chanel/recordings/${id}`,
        method: "GET",
      }),
      providesTags: ["chat", "Chanel", "Group", "Chanel"],
    }),
  }),
});

export const {
  useCreateChatMutation,
  useDeleteMultipleMessageMutation,
  useGetSingleMessageQuery,
  useGetSearchMessageQuery,
  useCreateRecordMutation,
  useStopRecordMutation,
  useGetRecordQuery,
} = chatApi;
