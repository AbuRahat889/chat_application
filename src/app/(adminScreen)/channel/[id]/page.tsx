/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import ContextMenu from "@/components/ContextMenu";
import RightSidebar from "@/components/RightSideBar/RightSidebar";
import SearchField from "@/components/SearchField/SearchField";
import { ContextMenuPosition, SocketMessage } from "@/Types/Chat";
import PinnedMessages from "@/components/Chat/PinnedMessages";
import MessageList from "@/components/Chat/MessageList";
import ChatHeader from "@/components/Chat/ChatHeader";
import { useAppSelector } from "@/redux/hooks";
import { useParams, useRouter } from "next/navigation";
import {
  useCreateChatMutation,
  // useGetSearchMessageQuery,
} from "@/redux/api/chatApi";
import MessageInput from "@/components/Chat/MessageInput";
import ReplayMessage from "@/components/Chat/ReplayMessages";
import { cn } from "@/lib/utils";
import EditMessage from "@/components/Chat/EditMessage";
import { clearChatValues } from "@/redux/features/optimistic/opmisticSlice";
import { useDispatch } from "react-redux";

const ChatPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const params = useParams();
  const ws = useRef<WebSocket | null>(null);
  const { token, user } = useAppSelector((state) => state.auth);

  const [isSearchFieldOpen, setIsSearchFieldOpen] = useState(false);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [socketMessage, setSocketMessage] = useState<SocketMessage | null>(
    null
  );
  const [contextMenuPosition, setContextMenuPosition] =
    useState<ContextMenuPosition>({
      x: 0,
      y: 0,
    });
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [pinnedMessageIds, setPinnedMessageIds] = useState<string[]>([]);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isReplayOpen, setIsReplayOpen] = useState(false);
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);

  // const [isEdit, setIsEdit] = useState(false);

  // const [editToMessageId, setEditToMessageId] = useState<string | null>(null);

  const [isStreamingStatus, setIsStreaminStatus] = useState(true);

  const [createChatMutation, { error }] = useCreateChatMutation();
  const searchFieldRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  // const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  // const [currentIndex, setCurrentIndex] = useState(0);

  // Filtered messages based on the search query
  const filteredMessage =
    searchQuery.trim() === ""
      ? []
      : socketMessage?.message?.filter((message: any) =>
          message?.message?.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // Navigate through search matches
  const handleSearchNavigation = (direction: "next" | "prev") => {
    if (!filteredMessage || filteredMessage.length === 0) return;

    setCurrentSearchIndex((prevIndex) => {
      const nextIndex =
        direction === "next"
          ? (prevIndex + 1) % filteredMessage.length
          : (prevIndex - 1 + filteredMessage.length) % filteredMessage.length;

      // Scroll to the matched message
      const matchedMessageId = filteredMessage[nextIndex]?.id;
      const matchedMessageElement = messageRefs.current[matchedMessageId];

      if (matchedMessageElement) {
        matchedMessageElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return nextIndex;
    });
  };

  // // Ref for all message elements

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const query = e.target.value.toLowerCase();
  //   setSearchQuery(query);

  //   const matches = socketMessage?.message
  //     ?.map((msg, idx) =>
  //       msg.message.toLowerCase().includes(query) ? idx : -1
  //     )
  //     .filter((idx) => idx !== -1);

  //   setMatchedIndices(matches || []);
  //   setCurrentIndex(0);
  // };

  useEffect(() => {
    if (!isSearchFieldOpen) {
      setSearchQuery("");
      setCurrentSearchIndex(0);
    }
  }, [isSearchFieldOpen]);

  const handleSearchField = () => {
    setIsSearchFieldOpen(!isSearchFieldOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchFieldRef.current &&
        !searchFieldRef.current.contains(event.target as Node)
      ) {
        setIsSearchFieldOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = (formData: FormData) => {
    if (newMessage.trim() === "" && !formData?.get("sendFiles")) return;

    // setSocketMessage(formData);

    if (editingMessageId) {
      formData.append("message", newMessage);
      sendWebSocketMessage({
        type: "editMessage",
        channelId: params.id as string,
        messageId: editingMessageId,
        message: formData.get("message"),
      });
      setEditingMessageId(null);
    } else {
      formData.append("message", newMessage);
      createChatMutation({
        id: params.id,
        formData,
      })
        .unwrap()
        .then((response) => {
          console.log("Message sent successfully", response);
          setIsReplayOpen(false);
          dispatch(clearChatValues()); // Update Redux state with new content
        })
        .catch((error) => {
          console.error("Error sending message", error);
        });
    }
    setNewMessage("");
  };

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, messageId: string) => {
      e.preventDefault();
      setShowContextMenu(true);
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setSelectedMessageIds([messageId]);
    },
    []
  );

  const handleCloseContextMenu = useCallback(() => {
    setShowContextMenu(false);
    setSelectedMessageIds([]);
  }, []);

  const handleStream = useCallback(
    (status: boolean) => {
      // Send the WebSocket message with the updated status immediately
      sendWebSocketMessage({
        type: "streaming",
        channelId: params.id,
        isStreaming: status, // use the status directly here
      });
    },
    [params.id]
  );

  const handlePin = useCallback(
    (ids: string[]) => {
      ids.forEach((id) => {
        sendWebSocketMessage({
          type: "pinMessage",
          channelId: params.id as string,
          messageId: id,
          isPinned: !pinnedMessageIds.includes(id),
        });
      });
    },
    [params.id, pinnedMessageIds]
  );

  // Function to remove HTML tags
  const stripHtml = (html: any) => {
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // Removes all HTML tags
  };

  const handleCopy = useCallback(
    (ids: string[]) => {
      if (socketMessage && socketMessage.message) {
        // Extract messages based on selected IDs
        const copiedMessages = socketMessage.message
          .filter((msg) => ids.includes(msg.id))
          .map((msg) => stripHtml(msg.message)) // Strip HTML before copying
          .join("\n");

        navigator.clipboard.writeText(copiedMessages).then(
          () => {
            console.log(`${ids.length} message(s) copied to clipboard`);
          },
          () => {
            console.log("Failed to copy messages");
          }
        );
      }
    },
    [socketMessage]
  );

  const handleEdit = useCallback(
    (id: string) => {
      setEditingMessageId(id);
      if (socketMessage && socketMessage.message) {
        const messageToEdit = socketMessage.message.find(
          (msg) => msg.id === id
        );
        if (messageToEdit) {
          setNewMessage(messageToEdit.message);
          setEditingMessageId(id);
        }
      }

      if (!isEditOpen) {
        setIsEditOpen(true);
      }
      setShowContextMenu(false);
    },
    [socketMessage, isEditOpen]
  );

  //replay message selectedMessageIds

  const handleReply = (selectedMessageIds: string) => {
    // replyId
    setReplyToMessageId(selectedMessageIds); // Set the message ID being replied to
    // setIsReplayOpen(false);
    if (!isReplayOpen) {
      setIsReplayOpen(true);
    }
    setShowContextMenu(false);
  };

  //single  message delete
  const handleDelete = useCallback(
    (ids: string[]) => {
      if (ids?.length === 1) {
        sendWebSocketMessage({
          type: "deleteMessage",
          channelId: params.id as string,
          messageId: ids[0],
        });
      }
    },
    [params.id]
  );

  // {
  //   "type": "multipleDeleteMessages",
  //   "channelId": "677b60bcc6280dedefcd46cb",
  //   "messageIds": [
  //     "677cd1d09ff01ad90dd46e05",
  //     "677cd2699ff01ad90dd46e06"
  //   ]
  // }

  //multiple message delete
  const handleMultipleDelete = useCallback(
    (ids: string[]) => {
      if (ids?.length === 1) {
        sendWebSocketMessage({
          type: "multipleDeleteMessages",
          channelId: params.id as string,
          messageIds: ids,
        });
      }
    },
    [params.id]
  );

  const sendWebSocketMessage = (message: object) => {
    if (ws?.current && ws?.current?.readyState === WebSocket.OPEN) {
      ws?.current?.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected!");
    }
  };

  useEffect(() => {
    if (token && user && params?.id) {
      try {
        ws.current = new WebSocket("wss://app.boom360trader.com");

        ws.current.onopen = () => {
          console.log("WebSocket Client Connected");
          sendWebSocketMessage({
            type: "subscribe",
            channelId: params?.id,
          });
        };

        ws.current.onmessage = (message) => {
          try {
            const parsedData = JSON.parse(message.data);
            setSocketMessage(parsedData);

            // Check if the message type is 'streamStatus' and update the UI
            if (parsedData?.type === "streaming") {
              const { isStreaming } = parsedData;
              // Update the UI with the streaming status (you can set a state here)
              setIsStreaminStatus(isStreaming); // Assuming you have setIsStreaming for state
            }

            if (parsedData?.type === "pastMessages") {
              setPinnedMessageIds(
                parsedData?.message
                  .filter((msg: any) => msg.isPinned)
                  .map((msg: any) => msg.id)
              );
            }
            setReplyToMessageId("");
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.current.onerror = (error) => {
          console.error("WebSocket Error:", error);
        };

        ws.current.onclose = (event) => {
          console.log("WebSocket Client Disconnected", event.reason);
        };
      } catch (error) {
        console.error("WebSocket connection failed:", error);
      }

      return () => {
        if (ws.current) {
          ws.current.close();
          console.log("WebSocket connection closed");
        }
      };
    }
  }, [token, user, params?.id]);

  //handle session time out
  useEffect(() => {
    if ((error as any)?.status === 408) {
      // window.location.replace("/login");

      router.push("/login");
    }
  }, [error, router]);

  // sidebar close when "ESC" key is pressed
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false); // Close the sidebar
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsSidebarOpen]);

  return (
    <div>
      <div className="flex flex-col justify-between h-screen text-white relative">
        <ChatHeader
          onDelete={handleMultipleDelete}
          setIsMultiSelectActive={setIsMultiSelectActive}
          isMultiSelectActive={isMultiSelectActive}
          id={params.id as string}
          handleSearchField={handleSearchField}
          toggleSidebar={toggleSidebar}
        />
        <div ref={searchFieldRef} className="absolute w-full top-28 right-40">
          {isSearchFieldOpen && (
            <SearchField
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredMessage={filteredMessage || []}
              currentIndex={currentSearchIndex}
              onNavigate={handleSearchNavigation}
            />
          )}
        </div>

        <div>
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="bg-[rgba(25,35,47,0.70)] fixed top-0 left-0 right-0 bottom-0 transition-all duration-300 ease-in-out"
            ></div>
          )}
          <div
            className={`fixed top-0 right-0 h-full bg-[#19232F] transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0 z-[999999]" : "translate-x-full"
            }`}
            style={{ width: "360px" }}
          >
            <RightSidebar
              id={params.id as string}
              toggleSidebar={toggleSidebar}
            />
          </div>
        </div>

        <div
          className={cn(
            `${
              filteredMessage?.length === 0
                ? " absolute top-[72px] left-0 right-0 z-50"
                : ""
            }`
          )}
        >
          <PinnedMessages
            socketMessage={socketMessage}
            pinnedMessageIds={pinnedMessageIds}
            handleContextMenu={handleContextMenu}
          />
        </div>

        <MessageList
          searchQuery={searchQuery}
          filteredMessage={filteredMessage}
          isMultiSelectActive={isMultiSelectActive}
          socketMessage={socketMessage}
          selectedMessageIds={selectedMessageIds}
          handleContextMenu={handleContextMenu}
          currentUserId={currentUserId}
          isStreamingStatus={isStreamingStatus}
          handleStream={handleStream}
          handleSendMessage={handleSendMessage}
        />

        <EditMessage
          setIsEditOpen={setIsEditOpen}
          isEditOpen={isEditOpen}
          socketMessage={socketMessage}
          editingMessageId={editingMessageId ?? ""}
          handleContextMenu={handleContextMenu}
          handleEdit={handleEdit}
        />

        <ReplayMessage
          setIsReplayOpen={setIsReplayOpen}
          isReplayOpen={isReplayOpen}
          socketMessage={socketMessage}
          replyToMessageId={replyToMessageId ?? ""}
          handleContextMenu={handleContextMenu}
          handleReply={handleReply}
        />

        <MessageInput
          channelId={params.id as string}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          editingMessageId={editingMessageId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          replyToMessageId={replyToMessageId ?? ""}
          handleStream={handleStream}
        />
      </div>

      <ContextMenu
        setIsMultiSelectActive={setIsMultiSelectActive}
        isMultiSelectActive={isMultiSelectActive}
        show={showContextMenu}
        position={contextMenuPosition}
        onClose={handleCloseContextMenu}
        onPin={handlePin}
        onCopy={handleCopy}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedIds={selectedMessageIds}
        messages={socketMessage?.message || []}
        pinnedMessageIds={pinnedMessageIds}
        onReply={handleReply} // Add reply handler
      />
    </div>
  );
};

export default ChatPage;
