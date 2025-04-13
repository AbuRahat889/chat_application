import React from "react";
import Image from "next/image";
import { IoInformationCircle, IoSearchOutline } from "react-icons/io5";
import blankImage from "@/assets/image.png";
import { useParams } from "next/navigation";
import { useGetChanelByIdQuery } from "@/redux/api/channel";
import { useDeleteMultipleMessageMutation } from "@/redux/api/chatApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { RxCross2 } from "react-icons/rx";
import { cn } from "@/lib/utils";
import trash from "@/assets/trash.svg";
import { resetMessageIds } from "@/redux/features/messageSlice/messageSlice";

// import { clearMessageIds } from "@/redux/features/messageSlice";

interface ChatHeaderProps {
  id: string | string[] | undefined;
  handleSearchField: () => void;
  toggleSidebar: () => void;
  isMultiSelectActive: boolean;
  setIsMultiSelectActive: (active: boolean) => void;
  onDelete: (ids: string[]) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  handleSearchField,
  toggleSidebar,
  isMultiSelectActive,
  setIsMultiSelectActive,
  onDelete,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetChanelByIdQuery(id);

  //get all selected message id
  const messageIds = useSelector(
    (state: RootState) => state.message.messageIds
  );

  // handle multiple delete message
  const [deleteMessageId] = useDeleteMultipleMessageMutation();

  const handleSelectMessageForDelete = async () => {
    const res = await deleteMessageId({ ids: messageIds });

    onDelete(messageIds);
    if (res?.data?.success) {
      dispatch(resetMessageIds());
      setIsMultiSelectActive(false)
    } else {
      console.error("Failed to delete messages");
    }
  };

  const handleMultiSelectToggle = () => {
    setIsMultiSelectActive(!isMultiSelectActive);
  };

  return (
    <div className="flex items-center justify-between px-6 h-[72px] bg-[#19232F] shadow-custom">
      {isLoading ? (
        <div>
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="mt-1 h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Image
            className="w-10 h-10 rounded-full"
            src={
              data?.result?.chanelImage ? data?.result?.chanelImage : blankImage
            }
            alt="menu"
            height={200}
            width={200}
          />
          <div>
            <h1 className="text-lg font-bold">{data?.result?.chanelName}</h1>
            <p className="text-sm text-gray-400">
              {data?.result?.memberIds.length} Subscription Member
            </p>
          </div>
        </div>
      )}

      {isMultiSelectActive && (
        <div className="absolute flex items-center gap-2 top-4 right-10  h-10">
          <div
            onClick={handleMultiSelectToggle}
            className="flex items-center gap-1 cursor-pointer"
          >
            <RxCross2 className="cursor-pointer" /> Cancel
          </div>

          <Image
            onClick={handleSelectMessageForDelete}
            src={trash}
            alt="trash"
            height={100}
            width={100}
            className="h-5 w-5 cursor-pointer "
          />
        </div>
      )}

      <div
        className={cn(
          `flex items-center gap-4 ${isMultiSelectActive ? "hidden" : ""}`
        )}
      >
        <button onClick={handleSearchField}>
          <IoSearchOutline className="h-8 w-8 text-[#D1B206]" />
        </button>
        <button onClick={toggleSidebar}>
          <IoInformationCircle className="h-8 w-8 text-[#D1B206]" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
