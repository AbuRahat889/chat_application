/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import liveStrim from "@/assets/LiveStrim.png";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import arrowRight from "@/assets/arrowRight.svg";
import { useDispatch, useSelector } from "react-redux";
import { setChatValues } from "@/redux/features/optimistic/opmisticSlice";

interface LivestreamCardProps {
  handleStream: (isStreaming: boolean) => void;
  handleSendMessage: (formData: FormData) => void;
}

const LivestreamCard: React.FC<LivestreamCardProps> = ({
  handleStream,
  handleSendMessage,
}) => {
  // Function to open the modal
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const dispatch = useDispatch();
  //get recording url
  const chatState = useSelector((state: any) => state.chat);

  console.log(chatState?.message, "this is chat state///////////");

  const handleJoinClick = () => {
    const agoraVideoPageUrl = "/agoraVideoCall"; // URL of the Agora Video Call page
    window.open(agoraVideoPageUrl, "_blank"); // Opens in a new tab
  };

  const handleSendRecordingFile = () => {
    const recordingUrl = localStorage.getItem("recordingUrl");

    console.log(recordingUrl, "rrecordingUrl");
    const formData = new FormData();
    dispatch(
      setChatValues({
        searchQuery: "",
        isMultiSelectActive: false,
        // files: selectedFile,
        name: "",
        department: "",
        messageId: "",
        message: recordingUrl,
        createdAt: "",
        isSender: false,
        avatar: "",
        replyMsgId: "",
        isStreamingStatus: true,
      })
    );

    formData.append("bodyData", JSON.stringify({ message: recordingUrl }));

    handleSendMessage(formData);

    handleStream(false);
    // dispatch(clearChatValues());
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  };

  return (
    <div className="bg-[#1F242F] text-white p-6 rounded-lg shadow-md w-96 mr-6 relative">
      {/* Live Icon and Title */}
      <div className="mb-4">
        <Image src={liveStrim} alt="liveStrim" className="h-6 w-12 mb-3" />
        <h2 className="text-lg font-bold">Join our livestream!</h2>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-gray-400 mb-6">
        Click Button Below To Join The Livestream
      </p>

      {/* Join Button */}
      <button
        onClick={handleJoinClick}
        className="w-full bg-[#17b26a] text-white font-bold py-2 hover:bg-[#17b26a9d] transition-colors"
      >
        Join Livestream
      </button>

      {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
        <button
          onClick={() => handleSendRecordingFile()}
          className="w-full mt-2 bg-red-600  text-white font-bold py-2   transition-colors"
        >
          stop Streaming
        </button>
      )}

      {/* Right arrow in message card */}
      <div className=" absolute bottom-[8px] -right-14 ">
        <Image
          src={arrowRight}
          alt="arrow"
          height={100}
          width={100}
          className="max-w-[70%]"
        />
      </div>
    </div>
  );
};

export default LivestreamCard;
