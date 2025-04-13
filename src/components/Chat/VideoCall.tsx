/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import AgoraRTC, {
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import { agoraClient } from "./AgoraClient";

interface VideoCallProps {
  appId: string | undefined;
  token: string;
  channelName: string;
  uid: number | null;
}

const VideoCall: React.FC<VideoCallProps> = ({
  appId,
  token,
  channelName,
  uid,
}) => {
  const [isJoined, setIsJoined] = useState(false); // Track if user has joined
  const [isJoining, setIsJoining] = useState(false); // Prevent multiple join attempts
  const [error, setError] = useState<string | null>(null); // Track errors
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]); // Track remote users
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null); // Local video track
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null); // Local audio track
  const localVideoRef = useRef<HTMLDivElement | null>(null); // Local video ref

  useEffect(() => {
    return () => {
      // Clean up tracks on unmount
      localVideoTrack?.close();
      localAudioTrack?.close();
    };
  }, [localVideoTrack, localAudioTrack]);

  const requestCameraAccess = async () => {
    try {
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      setLocalVideoTrack(videoTrack);
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to access the camera. Please check your permissions.");
    }
  };

  const requestAudioAccess = async () => {
    try {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(audioTrack);
    } catch (err) {
      console.log(err);
      setError(
        "Failed to access the microphone. Please check your permissions."
      );
    }
  };

  const joinChannel = async () => {
    if (isJoining || !localVideoTrack || !localAudioTrack) {
      setError("Camera and microphone access are required to join.");
      return;
    }
    setIsJoining(true);
    setError(null);

    if (!appId || !token || !channelName || uid === null) {
      setError("Missing required Agora parameters.");
      setIsJoining(false);
      return;
    }

    try {
      // Join the channel
      await agoraClient.join(appId, channelName, token, uid);

      // Publish tracks
      await agoraClient.publish([localVideoTrack, localAudioTrack]);

      setIsJoined(true);

      // Handle remote users joining
      agoraClient.on(
        "user-published",
        async (user: IAgoraRTCRemoteUser, mediaType: "video" | "audio") => {
          await agoraClient.subscribe(user, mediaType);

          if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            if (remoteVideoTrack) {
              const remoteVideoContainer = document.getElementById(
                `remote-${user.uid}`
              );
              if (!remoteVideoContainer) {
                const newContainer = document.createElement("div");
                newContainer.id = `remote-${user.uid}`;
                newContainer.style.width = "200px";
                newContainer.style.height = "150px";
                newContainer.style.margin = "10px";
                document
                  .getElementById("remote-videos")
                  ?.appendChild(newContainer);
                remoteVideoTrack.play(newContainer);
              }
            }
          }
          setRemoteUsers((prevUsers) => [...prevUsers, user]);
        }
      );

      // Handle remote users leaving
      agoraClient.on("user-unpublished", (user: IAgoraRTCRemoteUser) => {
        const remoteContainer = document.getElementById(`remote-${user.uid}`);
        if (remoteContainer) {
          remoteContainer.remove();
        }
        setRemoteUsers((prevUsers) =>
          prevUsers.filter((remoteUser) => remoteUser.uid !== user.uid)
        );
      });
    } catch (error: any) {
      setError(error.message || "An error occurred.");
    } finally {
      setIsJoining(false);
    }
  };

  const leaveChannel = async () => {
    try {
      await agoraClient.leave();
      console.log("Left the channel.");
      setIsJoined(false);

      // Remove all remote user elements
      remoteUsers.forEach((user) => {
        const remoteContainer = document.getElementById(`remote-${user.uid}`);
        if (remoteContainer) remoteContainer.remove();
      });
      setRemoteUsers([]);
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  return (
    <div className="bg-white p-4">
      {error && (
        <div className="text-red-500 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div
        ref={localVideoRef}
        style={{
          width: "400px",
          height: "300px",
          backgroundColor: "#000",
          marginBottom: "20px",
        }}
      >
        {localVideoTrack && (
          <p className="text-white text-center">Your Video</p>
        )}
      </div>

      <div id="remote-videos" className="flex flex-wrap"></div>

      {!localVideoTrack && (
        <button
          onClick={requestCameraAccess}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Enable Camera
        </button>
      )}
      {!localAudioTrack && (
        <button
          onClick={requestAudioAccess}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4"
        >
          Enable Microphone
        </button>
      )}
      {!isJoined && localVideoTrack && localAudioTrack && (
        <button
          onClick={joinChannel}
          disabled={isJoining}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isJoining ? "Joining..." : "Join"}
        </button>
      )}
      {isJoined && (
        <button
          onClick={leaveChannel}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Leave
        </button>
      )}
    </div>
  );
};

export default VideoCall;

// "use client";

// import React, { useState } from "react";
// import AgoraUIKit from "agora-react-uikit";

// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const VideoCall = ({ videoCallingId }: { videoCallingId: string }) => {
//   const [startVideoCall, setStartVideoCall] = useState(false);

//   const router = useRouter();

//   const rtcProps = {
//     appId: process.env.NEXT_PUBLIC_VIDEO_CALL_APP_ID || "test",
//     channel: videoCallingId, // your agora channel
//     token: null, // use null or skip if using app in testing mode
//   };

//   const callbacks = {
//     EndCall: () => {
//       setStartVideoCall(false);
//       router.push("/dashboard");
//     },
//   };
//   return startVideoCall ? (
//     <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
//       <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
//     </div>
//   ) : (
//     <div>
//       <div onClick={() => setStartVideoCall(true)}>Start Call</div>
//       <Image
//         src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExb25jMWk1b3VxYWtjYTdpZXlnNGcwZHVqcGppejM3bDUybTl3aXQ0ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/PnHX3RAVHsjHXTO4qv/giphy.gif"
//         width={500}
//         height={500}
//         alt="video call gif"
//       />
//     </div>
//   );
// };

// export default VideoCall;
