import React, { useState } from "react";
import { SocketMessage } from "@/Types/Chat";
import PinnedMessagesDrawer from "./PinnedMessagesDrawer";
import Link from "next/link";

interface PinnedMessagesProps {
  socketMessage: SocketMessage | null;
  pinnedMessageIds: string[];
  handleContextMenu: (e: React.MouseEvent, messageId: string) => void;
}

const PinnedMessages: React.FC<PinnedMessagesProps> = ({
  socketMessage,
  pinnedMessageIds,
  handleContextMenu,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (
    !socketMessage ||
    !socketMessage.message ||
    pinnedMessageIds.length === 0
  ) {
    return null;
  }

  const pinnedMessages = socketMessage.message.filter((msg) =>
    pinnedMessageIds.includes(msg.id)
  );

  if (pinnedMessages.length === 0) {
    return null;
  }

  // Get the current pinned message based on the index
  const currentMessage = pinnedMessages[currentIndex];

  const handleToggle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pinnedMessages.length);
  };

  return (
    <div className="bg-[#19232F] mx-10 mt-2 py-1 flex justify-between items-center z-50 ">
      <div
        key={`pinned-${currentMessage.id}`}
        onClick={handleToggle} // Toggle to the next pinned message on click
        onContextMenu={(e) => handleContextMenu(e, currentMessage.id)}
        className="flex flex-1 cursor-pointer"
      >
        <Link
          href={`#currentMessage.id`}
          id={currentMessage.id}
          className="border-solid border-[#D1B206] pl-2 ml-5 border-l-2"
        >
          <p className="text-[#425FAD] text-[14px] font-semibold">
            Pinned Message ({currentIndex + 1}/{pinnedMessages.length})
          </p>
          <p
            className="text-[14px] font-medium text-white line-clamp-1"
            dangerouslySetInnerHTML={{ __html: currentMessage.message }}
          ></p>
        </Link>
      </div>
      <div className="mr-5">
        <PinnedMessagesDrawer pinnedMessages={pinnedMessages} />
      </div>
    </div>
  );
};

export default PinnedMessages;
