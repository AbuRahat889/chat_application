/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useCreateRecordMutation,
  useStopRecordMutation,
} from "@/redux/api/chatApi";
import React, { useState } from "react";
import { FaPersonRunning } from "react-icons/fa6";
import Swal from "sweetalert2";

interface AgoraVideoCallProps {
  uid?: number;
  channelName?: string;
  joinChannel: () => void;
  leaveChannel: () => void;
  channelId?: string;
  // localVideoRef: React.RefObject<HTMLDivElement>;
}

const AgoraVideoCall: React.FC<AgoraVideoCallProps> = ({
  joinChannel,
  leaveChannel,
  channelName,
  channelId,
  // localVideoRef,
}) => {
  const [startStreaming, setStartStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInfo, setRecordingInfo] = useState<{ data?: any }>();

  const [recordingFn] = useCreateRecordMutation();
  const [stoprecordingFn] = useStopRecordMutation();

  const randomUid = Math.floor(Math.random() * 1000000);
  const uid = randomUid;

  console.log(channelName, uid, channelId, "this is channel name and uid");

  const handleLeave = () => {
    let timerInterval: NodeJS.Timeout;
    Swal.fire({
      title: "You left the meeting",
      html: "If you rejoin this meeting, click the join button after <b></b> seconds.",
      timer: 3000, // Total time in milliseconds
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timerElement = Swal.getPopup()?.querySelector("b");
        if (timerElement) {
          // Set an interval to update the timer in seconds
          timerInterval = setInterval(() => {
            const timerLeft = Swal.getTimerLeft(); // Remaining time in milliseconds
            if (timerLeft) {
              timerElement.textContent = (timerLeft / 1000).toFixed(1); // Convert to seconds and display 1 decimal place
            }
          }, 100);
        }
      },
      willClose: () => {
        clearInterval(timerInterval); // Clear the interval when closing
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
    handleStopRecording();
  };

  const handleStartRecording = async () => {
    const res = await recordingFn({ channel: channelName, uid });
    setIsRecording(true);
    setRecordingInfo(res);

    console.log(res, channelId, "this is recording data");
  };

  const handleStopRecording = async () => {
    console.log(
      channelId,
      recordingInfo?.data?.details?.uid,
      recordingInfo?.data?.details?.sid,
      recordingInfo?.data?.details?.resourceId,
      "this is recording info////////// from start record"
    );

    const res = await stoprecordingFn({
      channelId: channelId,
      channel: recordingInfo?.data?.details?.cname,
      uid: recordingInfo?.data?.details?.uid,
      sid: recordingInfo?.data?.details?.sid,
      resourceId: recordingInfo?.data?.details?.resourceId,
    });
    console.log(res?.data?.presignedUrl, "click the stop recording ");
    setIsRecording(false);
    localStorage.setItem("recordingUrl", res?.data?.presignedUrl);
  };

  return (
    <div
      style={{ color: "white" }}
      className="relative rounded-md top-3 w-full z-10 shadow-custom1"
    >
      <div className="absolute left-[35%] bottom-10 ">
        {!startStreaming && (
          <button
            className="text-white bg-green-600 font-semibold py-3 px-10 rounded-lg "
            onClick={() => {
              joinChannel();
              setStartStreaming(true);
            }}
          >
            Join
          </button>
        )}

        {startStreaming && (
          <div className="flex gap-5 justify-center items-center">
            <button
              className="bg-red-500 flex gap-1 items-center text-xl py-3 px-10 rounded-lg z-50"
              onClick={() => {
                leaveChannel();
                setStartStreaming(false);
                handleLeave();
              }}
            >
              <FaPersonRunning className="text-xl" />
              Leave
            </button>

            {!isRecording ? (
              <button
                className="bg-blue-500 flex gap-1 items-center text-xl py-3 px-10 rounded-lg z-50"
                onClick={handleStartRecording}
              >
                Start Recording
              </button>
            ) : (
              <button
                className="bg-red-600 flex gap-1 items-center text-xl py-3 px-10 rounded-lg z-50"
                onClick={handleStopRecording}
              >
                Stop Recording
              </button>
            )}
          </div>
        )}
      </div>

      <div className="z-0">
        <div
          id="local-video-container"
          style={{
            width: "full",
            minHeight: "98vh",
            backgroundColor: "black",
            border: "1px solid white",
          }}
        ></div>
      </div>

      <div>
        <div id="remote-videos" style={{ display: "flex", gap: "16px" }}></div>
      </div>
    </div>
  );
};

export default AgoraVideoCall;
