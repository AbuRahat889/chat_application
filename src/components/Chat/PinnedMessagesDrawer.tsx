/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Drawer } from "antd";
import { FiList } from "react-icons/fi";
import ChatMessage from "../AdminScreen/MessageCard";
import { useAppSelector } from "@/redux/hooks";
import { RxCross2 } from "react-icons/rx";

interface PinnedMessagesDrawerProps {
  pinnedMessages: { message: string }[];
}

const PinnedMessagesDrawer: React.FC<PinnedMessagesDrawerProps> = ({
  pinnedMessages,
}) => {
  const [open, setOpen] = useState(false);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div onClick={showDrawer} className="cursor-pointer">
        <FiList className="text-2xl text-[#D1B206]" />
      </div>
      <Drawer
        title="Pinned Messages"
        width={550}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
            backgroundColor: "#0c111d",
            // opacity: 10,
          },
        }}
        closeIcon={
          <span
            style={{ color: "#FFD700", fontSize: "20px", margin: "2px 0 0 0" }}
          >
            <RxCross2 />
          </span>
        }
      >
        <div>
          {pinnedMessages.length > 0 ? (
            pinnedMessages.map((msg: any, index: any) => (
              <ChatMessage
                key={index?.id}
                isMultiSelectActive={false}
                files={msg.files}
                name={msg.user.username}
                department={msg.user.role}
                messageId={msg.id}
                message={msg.message}
                createdAt={msg.createdAt}
                isSender={msg.user.id === currentUserId}
                avatar={msg.user.avatar}
                isStreamingStatus={msg.isStreamingStatus}
              />
            ))
          ) : (
            <div>No pinned messages</div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default PinnedMessagesDrawer;
