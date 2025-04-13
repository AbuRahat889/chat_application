"use client";

import React from "react";
import liveStrim from "@/assets/LiveStrim.png";
import Image from "next/image";

// import arrowRight from "@/assets/arrowRight.svg";

interface LivestreamCardProps {
  message: string;
}

const RecordingCard: React.FC<LivestreamCardProps> = ({ message }) => {
  // Function to open the modal

  console.log(message, "sdlfkjsalfkd jlkfjd lsakj dflkj");

  const handleJoinClick = () => {
    console.log(message);
    // const agoraVideoPageUrl = { message }; // URL of the Agora Video Call page
    window.open(message, "_blank"); // Opens in a new tab
  };

  const video = document.createElement("video");
  video.src = message; // replace with the actual URL of the video

  video.onloadedmetadata = function () {
    console.log("Video duration:", video.duration); // duration in seconds
  };
  return (
    <div className="bg-[#1F242F] text-white rounded-lg shadow-md w-96 p-1 mr-6 relative">
      {/* Live Icon and Title */}
      <div className="mb-4">
        <Image src={liveStrim} alt="liveStrim" className="h-6 w-12 mb-3" />
        <h2 className="text-lg font-bold">The recording is ready!</h2>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-gray-400 mb-6">
        <video src={message} className="hidden"></video>
        the recording is ready, click the button and see the video
      </p>

      {/* Join Button */}
      <button
        onClick={handleJoinClick}
        className="w-full bg-[#425fad] text-white font-bold py-2 hover:bg-[#425faddc] transition-colors"
      >
        Watch Recording
      </button>

      {/* Right arrow in message card */}
      {/* <div className=" absolute bottom-[8px] -right-12 ">
        <Image
          src={arrowRight}
          alt="arrow"
          height={100}
          width={100}
          className="max-w-[70%]"
        />
      </div> */}
    </div>
  );
};

export default RecordingCard;
