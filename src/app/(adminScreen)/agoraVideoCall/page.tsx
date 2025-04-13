/* eslint-disable @typescript-eslint/no-explicit-any */
// import AgoraVideoCall from "@/components/Ch/at/AgoraVideoCall";
"use client";
import AgoraVideoCall from "@/components/Chat/AgoraVideoCall";
import useAgora from "@/customHook/useAgora";
import React, { useRef } from "react";
import { useSelector } from "react-redux";

export default function Page() {
  const localVideoRef = useRef<HTMLDivElement>(null!);

  const appState = useSelector((state: any) => state.agoraSlice || {});
  const { uid, channelName, agoraToken, appId, channelId } = appState;

  const { joinChannel, leaveChannel } = useAgora({
    appId,
    channelName,
    agoraToken,
    uid,
    localVideoRef,
    channelId,
  });

  return (
    <div className="z-50">
      <AgoraVideoCall
        channelName={channelName}
        uid={uid}
        joinChannel={joinChannel}
        leaveChannel={leaveChannel}
        // localVideoRef={localVideoRef}
        channelId={channelId}
      />
    </div>
  );
}
