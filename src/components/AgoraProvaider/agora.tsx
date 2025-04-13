"use client";

import React from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

interface AgoraProps {
  children: React.ReactNode;
}

export default function AgoraClient({ children }: AgoraProps) {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <div>
      <AgoraRTCProvider client={client}>{children}</AgoraRTCProvider>
    </div>
  );
}
