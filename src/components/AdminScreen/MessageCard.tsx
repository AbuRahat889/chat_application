/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React, { useState } from "react";
import FileCard from "../Chat/FileCard";
import AudioCard from "../Chat/VoiceCard";
import { useDispatch } from "react-redux";
import arrowRight from "@/assets/arrowRight.svg";

import {
  addMessageId,
  removeMessageId,
} from "@/redux/features/messageSlice/messageSlice";
import { ChatMessageProps } from "@/Types/Chat";
import ReplyMessageCard from "../Chat/ReplyMessageCard";
import { useGetSingleMessageQuery } from "@/redux/api/chatApi";
import { cn } from "@/lib/utils";
import RecordingCard from "../Chat/RecordingCard";

// import LivestreamCard from "../Chat/LiveStrim";
// import LivestreamCard from "../Chat/LiveStrim";

const ChatMessage: React.FC<ChatMessageProps> = ({
  files,
  message,
  createdAt,
  isSender,
  isMultiSelectActive,
  messageId,
  replyMsgId,
  searchQuery,
}) => {
  const [isActive, setIsActive] = useState(false);

  // Function to check if the file is an image based on extension

  const time = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isImage = (file: any) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const fileExtension = file?.name?.split(".").pop()?.toLowerCase();
    return fileExtension ? imageExtensions.includes(fileExtension) : false;
  };

  // Function to check if the file is a .webm file (audio)
  const isWebmAudio = (file: any) => {
    if (!file) return false;

    // Check if file has a `name` property (e.g., from File API)
    if (file.name) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      return fileExtension === "webm";
    }

    // If file is a URL, extract extension from the URL
    if (typeof file === "string") {
      const fileExtension = file.split("?")[0].split(".").pop()?.toLowerCase();
      return fileExtension === "webm";
    }

    return false;
  };

  const dispatch = useDispatch();

  const handleClick = () => {
    setIsActive(!isActive);
    if (!isActive) {
      dispatch(addMessageId(messageId));
      //************************* */
    } else {
      dispatch(removeMessageId(messageId));
    }
  };

  const { data: replayMessage } = useGetSingleMessageQuery(replyMsgId);

  // useEffect(() => {
  //   // Select all elements whose text you want to extract
  //   const elements = document.querySelectorAll("searchText");

  //   // Log or use the array
  // }, [searchQuery]);

  const isRecordingLink = message?.startsWith("https://agoracloud.s3.us-east");

  return (
    <div
      onClick={handleClick}
      className={cn(` flex flex-col relative searchText z-`)}
    >
      {isMultiSelectActive && (
        <div
          // onClick={handleClick}
          className={`border border-[#D1B206] h-5 w-5 rounded-full absolute left-10 top-[50%] transform -translate-x-[50%] -translate-y-[50%]  ${
            isActive ? "bg-yellow-500 " : ""
          }`}
        ></div>
      )}

      <div
        className={`flex text-wrap relative mx-5  justify-end transition-all duration-300 ease-in-out  ${
          isMultiSelectActive ? "bg-[#fff5c2] bg-opacity-5 rounded-lg " : ""
        } py-2 my-1`}
      >
        <div
          className={`w-96 p-4 rounded-2xl shadow-lg bg-[#1F242F] text-white ${
            isSender ? "" : "bg-[#1F242F] text-white"
          }`}
        >
          {/* Reply message card */}
          {replyMsgId && (
            <ReplyMessageCard
              // name={replayMessage?.result?.user?.username}
              replayMessage={replayMessage?.result}
              isWebmAudio={isWebmAudio}
              isImage={isImage}
            />
          )}

          {/* If no message and file is available */}
          {!message && files?.length > 0 && (
            <div className="flex items-start justify-between">
              {isImage(files[0]) ? (
                <Image
                  src={files[0]}
                  alt="file"
                  height={200}
                  width={200}
                  className="h-[200px] w-[200px] z-0 overflow-hidden"
                />
              ) : isWebmAudio(files[0]) ? (
                <AudioCard url={files[0]} />
              ) : (
                <FileCard url={files[0]} />
              )}

              <p className="text-[10px] font-normal text-[#FAFAFA]">{time}</p>
            </div>
          )}

          {/* Render message if available, along with file if message exists */}
          {message && (
            <div className=" flex justify-between items-start">
              {isRecordingLink ? (
                <RecordingCard message={message} />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: message.replace(
                      new RegExp(`(${searchQuery})`, "gi"), // Match the full word
                      `<span class="bg-[#D1B206]">$1</span>` // Highlight the whole word
                    ),
                  }}
                  className={cn(
                    "text-formate flex-1 text-base text-wrap break-words gap-1"
                  )}
                ></div>
              )}

              <div className="flex flex-col justify-between items-start">
                {files?.length > 0 && (
                  <div>
                    {isImage(files[0]) ? (
                      <Image
                        src={files[0]}
                        alt="file"
                        height={200}
                        width={200}
                        className="h-[200px] w-[200px] "
                      />
                    ) : isWebmAudio(files[0]) ? (
                      <AudioCard url={files[0]} />
                    ) : (
                      <FileCard url={files[0]} />
                    )}
                  </div>
                )}
              </div>

              <p className="text-[10px]  font-normal text-[#FAFAFA]">{time}</p>
            </div>
          )}
        </div>

        {/* Right arrow in message card */}
        <div className=" absolute bottom-[8px] -right-14 ">
          <Image
            src={arrowRight}
            alt="arrow"
            height={100}
            width={100}
            className="max-w-[60%]"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
