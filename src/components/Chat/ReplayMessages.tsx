/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocketMessage } from "@/Types/Chat";
import React from "react";
import Crossicon from "../icons/Crossicon";
import Image from "next/image";
import AudioCard from "./VoiceCard";
import FileCard from "./FileCard";
import { useDispatch } from "react-redux";
import { clearContent } from "@/redux/features/editorSlice/editorSlice";

interface ReplayMessageProps {
  socketMessage: SocketMessage | null;
  replyToMessageId: string | null;
  handleContextMenu: (e: React.MouseEvent, messageId: string) => void;
  handleReply: (id: string) => void;
  setIsReplayOpen: (isOpen: boolean) => void;
  isReplayOpen: boolean;
}

const ReplayMessage: React.FC<ReplayMessageProps> = ({
  socketMessage,
  replyToMessageId,
  handleContextMenu,
  handleReply,
  isReplayOpen,
  setIsReplayOpen,
}) => {
  // const [isReplayOpen, setIsReplayOpen] = useState(true);
  const dispatch = useDispatch();

  if (
    !socketMessage ||
    !socketMessage.message ||
    replyToMessageId?.length === 0 ||
    !isReplayOpen // Hide component if isOpen is false
  ) {
    return null;
  }

  const replayMessages = socketMessage?.message?.filter((msg) =>
    replyToMessageId?.includes(msg.id)
  );

  if (replayMessages?.length === 0) {
    return null;
  }

  // Function to check if the file is an image based on extension
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

  const handleClearContent = () => {
    dispatch(clearContent()); // Clear content in Redux state
  };

  return (
    <div className="ml-10 px-10 py-1 mx-10">
      {replayMessages.map((msg) => (
        <div
          key={`pinned-${msg.id}`}
          onContextMenu={(e) => handleContextMenu(e, msg.id)}
          className="bg-[#19232F] flex justify-between border-t border-[#3A3A3A] p-2"
        >
          <div className="border-solid border-[#D1B206] pl-2 border-l-2 cursor-pointer">
            <p className="text-[#425FAD] text-[14px] font-semibold">
              Replay Message
            </p>

            <div
              dangerouslySetInnerHTML={{ __html: msg?.message }}
              className="text-formate flex-1 text-sm text-wrap break-words gap-1 line-clamp-1 "
            ></div>

            {msg?.files && msg?.files?.length > 0 && (
              <div className="flex flex-col mt-2">
                {isImage(msg?.files[0]) ? (
                  <Image
                    src={msg?.files[0]}
                    alt="file"
                    height={200}
                    width={200}
                    className="h-[50px] w-[50px] z-0 overflow-hidden"
                  />
                ) : isWebmAudio(msg?.files[0]) ? (
                  <AudioCard url={msg?.files[0]} />
                ) : (
                  <FileCard url={msg?.files[0]} />
                )}
              </div>
            )}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => {
              setIsReplayOpen(false); // Close the component
              handleReply(""); // Trigger the reply logic
              handleClearContent();
            }}
          >
            <div>
              <Crossicon />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReplayMessage;
