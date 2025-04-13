/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import ChatMessage from "@/components/AdminScreen/MessageCard";
import { SocketMessage } from "@/Types/Chat";
import LivestreamCard from "./LiveStrim";
import GradientDivider from "./Divideer";
import { useSelector } from "react-redux";

// import LivestreamCard from "./LiveStrim";

interface MessageListProps {
  currentUserId: any;
  isMultiSelectActive: boolean;
  socketMessage: SocketMessage | null;
  selectedMessageIds: string[];
  handleContextMenu: (e: React.MouseEvent, messageId: string) => void;
  isStreamingStatus: boolean;
  handleStream: (isStreaming: boolean) => void;
  filteredMessage: any;
  searchQuery: string;
  handleSendMessage: (formData: FormData) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  socketMessage,
  selectedMessageIds,
  handleContextMenu,
  isMultiSelectActive,
  currentUserId,
  isStreamingStatus,
  handleStream,
  filteredMessage,
  searchQuery,
  handleSendMessage,
}) => {
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const chatState = useSelector((state: any) => state.chat);

  console.log(chatState, "chatState from store ........");

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [socketMessage?.message]);

  if (!socketMessage || !Array.isArray(socketMessage.message)) {
    return (
      <div className="flex-1 overflow-auto px-4 py-6 text-wrap slim-scroll w-96">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="mb-4 animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-[#1f242f]"></div>
              <div className="flex-1">
                <div className="h-4 bg-[#1f242f] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#1f242f] rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-6 bg-[#1f242f] rounded mb-2"></div>
            <div className="h-3 bg-[#1f242f] rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  let lastMessageDate: string | null = null;

  return (
    <div
      ref={messageListRef}
      className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 text-wrap slim-scroll mr-12"
    >
      {filteredMessage && filteredMessage.length > 0
        ? filteredMessage.map((msg: any) => {
            const messageDate = new Date(msg.createdAt).toDateString();
            const shouldShowDivider = lastMessageDate !== messageDate;
            lastMessageDate = messageDate;

            return (
              <React.Fragment key={msg.id}>
                {shouldShowDivider && (
                  <GradientDivider
                    text={new Date(msg.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  />
                )}
                <div
                  id={msg.id}
                  onContextMenu={(e) => handleContextMenu(e, msg.id)}
                  className={
                    selectedMessageIds.includes(msg.id) ? "bg-transparent" : ""
                  }
                >
                  <ChatMessage
                    searchQuery={searchQuery}
                    isMultiSelectActive={isMultiSelectActive}
                    files={msg.files}
                    name={msg.user.username}
                    department={msg.user.role}
                    messageId={msg.id}
                    message={msg.message}
                    createdAt={msg.createdAt}
                    isSender={msg.user.id === currentUserId}
                    avatar={msg.user.avatar}
                    replyMsgId={msg.replyId}
                    isStreamingStatus={isStreamingStatus}
                  />
                </div>
              </React.Fragment>
            );
          })
        : socketMessage?.message
        ? socketMessage?.message.map((msg: any) => {
            const messageDate = new Date(msg.createdAt).toDateString();
            const shouldShowDivider = lastMessageDate !== messageDate;
            lastMessageDate = messageDate;

            return (
              <React.Fragment key={msg.id}>
                {shouldShowDivider && (
                  <GradientDivider
                    text={new Date(msg.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  />
                )}
                <div
                  id={msg.id}
                  onContextMenu={(e) => handleContextMenu(e, msg.id)}
                  className={
                    selectedMessageIds.includes(msg.id) ? "bg-transparent" : ""
                  }
                >
                  <ChatMessage
                    isMultiSelectActive={isMultiSelectActive}
                    files={msg.files}
                    name={msg.user.username}
                    department={msg.user.role}
                    messageId={msg.id}
                    message={msg.message}
                    createdAt={msg.createdAt}
                    isSender={msg.user.id === currentUserId}
                    avatar={msg.user.avatar}
                    replyMsgId={msg.replyId}
                    isStreamingStatus={isStreamingStatus}
                  />
                </div>
              </React.Fragment>
            );
          })
        : ""}

      {chatState && Object.keys(chatState).length > 0 && chatState.message && (
        <ChatMessage
          isMultiSelectActive={chatState?.isMultiSelectActive}
          files={chatState?.file}
          name={chatState?.name}
          department={chatState?.department}
          messageId={chatState?.messageId}
          message={chatState?.message}
          createdAt={new Date().toISOString()}
          isSender={chatState?.isSender}
          avatar={chatState?.avatar}
          replyMsgId={chatState?.replyMsgId}
          isStreamingStatus={chatState?.isStreamingStatus}
        />
      )}

      {lastMessageDate &&
        new Date().toLocaleString([], {
          month: "short",
          day: "2-digit",
        }) !==
          new Date(lastMessageDate).toLocaleString([], {
            month: "short",
            day: "2-digit",
          }) && (
          <GradientDivider
            text={new Date(lastMessageDate).toLocaleDateString([], {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          />
        )}

      <div className="flex justify-end">
        {socketMessage?.isStreaming === true && (
          <LivestreamCard
            handleStream={handleStream}
            handleSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default MessageList;
