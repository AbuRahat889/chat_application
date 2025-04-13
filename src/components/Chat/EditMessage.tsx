import { SocketMessage } from "@/Types/Chat";
import React from "react";
import Crossicon from "../icons/Crossicon";
import { useDispatch } from "react-redux";
import { clearContent } from "@/redux/features/editorSlice/editorSlice";
// import Image from "next/image";
// import AudioCard from "./VoiceCard";
// import FileCard from "./FileCard";

interface ReplayMessageProps {
  socketMessage: SocketMessage | null;
  editingMessageId: string | null;
  handleContextMenu: (e: React.MouseEvent, messageId: string) => void;
  handleEdit: (id: string) => void;
  setIsEditOpen: (isOpen: boolean) => void;
  isEditOpen: boolean;
}

const EditMessage: React.FC<ReplayMessageProps> = ({
  socketMessage,
  editingMessageId,
  handleContextMenu,
  handleEdit,
  setIsEditOpen,
  isEditOpen,
}) => {
  // const [isEdit, setIsEdit] = useState(true);
  // const content = useSelector((state: any) => state.editor.content);
  const dispatch = useDispatch();

  const handleClearContent = () => {
    dispatch(clearContent()); // Clear content in Redux state
  };

  if (
    !socketMessage ||
    !socketMessage.message ||
    editingMessageId?.length === 0 ||
    !isEditOpen // Hide component if isOpen is false
  ) {
    return null;
  }

  const editMessages = socketMessage?.message?.filter((msg) =>
    editingMessageId?.includes(msg.id)
  );

  if (editMessages?.length === 0) {
    return null;
  }

  return (
    <div className="ml-10 px-10 py-1 mx-10">
      {editMessages.map((msg) => (
        <div
          key={`pinned-${msg.id}`}
          onContextMenu={(e) => handleContextMenu(e, msg.id)}
          className="bg-[#19232F] flex justify-between border-t border-[#3A3A3A] p-2"
        >
          <div className="border-solid border-[#D1B206] pl-2 border-l-2 cursor-pointer">
            <p className="text-[#425FAD] text-[14px] font-semibold">
              Edit Message
            </p>

            <div
              dangerouslySetInnerHTML={{ __html: msg?.message }}
              className="text-formate flex-1 text-sm text-wrap break-words gap-1 line-clamp-1 "
            ></div>
          </div>

          <div
            className="cursor-pointer"
            onClick={() => {
              setIsEditOpen(false); // Close the component
              handleEdit(""); // Trigger the reply logic
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

export default EditMessage;
