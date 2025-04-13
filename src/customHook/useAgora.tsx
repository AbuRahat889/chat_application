/* eslint-disable @typescript-eslint/no-explicit-any */
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";

const useAgora = ({
  appId,
  channelName,
  agoraToken,
  uid,
  localVideoRef,
}: any) => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ILocalVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<ILocalAudioTrack | null>(null);

  useEffect(() => {
    const initAgora = async () => {
      const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

      setClient(agoraClient);
      agoraClient.on("user-published", async (user, mediaType) => {
        console.warn("Inside user-published");
        await agoraClient.subscribe(user, mediaType);
        console.warn("Subscribed successfully");
        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;
          if (remoteVideoTrack && localVideoRef.current) {
            remoteVideoTrack.play(localVideoRef.current);
          }
        }
        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          if (remoteAudioTrack) {
            remoteAudioTrack.play();
          }
        }
      });
    };

    if (!client) {
      initAgora();
    }
    return () => {
      const cleanUpAgora = async () => {
        if (localVideoTrack) {
          localVideoTrack.stop();
          localVideoTrack.close();
          setLocalVideoTrack(null);
        }

        if (localAudioTrack) {
          localAudioTrack.stop();
          localAudioTrack.close();
          setLocalAudioTrack(null);
        }
        if (client) {
          await client.leave();
          setClient(null);
        }
      };
      cleanUpAgora();
    };
  }, []);

  const setupLocalVideo = async () => {
    try {
      const cameras = await AgoraRTC?.getCameras();
      if (cameras?.length <= 0) {
        console.warn(" no camera");
        return;
      }
      const localVideoStream = await AgoraRTC?.createCameraVideoTrack();
      localVideoStream?.play("local-video-container");
    } catch (error) {
      console.error("Failed to create local video track", error);
    }
  };
  const joinChannel = async () => {
    if (!client) {
      return;
    }
    try {
      // Join the Agora channel

      await client.join(appId, channelName, agoraToken, uid);
      await setupLocalVideo();
      const cameras = await AgoraRTC.getCameras();
      let cameraTrack: ILocalVideoTrack | null = null;

      let microphoneTrack: ILocalAudioTrack | null = null;
      if (cameras.length > 0) {
        cameraTrack = await AgoraRTC.createCameraVideoTrack();
        setLocalVideoTrack(cameraTrack);
      }
      microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setLocalAudioTrack(microphoneTrack);

      // Play local video
      if (localVideoRef.current && localVideoTrack) {
        localVideoTrack.play(localVideoRef.current);
        console.log("Local video track playing.");
      }

      // Publish local tracks
      const tracksToPublish = [microphoneTrack, cameraTrack].filter(
        (track) => track !== null && track !== undefined
      );
      await client.publish(tracksToPublish);
      console.log("Published local tracks.");
    } catch (error) {
      console.error("Agora initialization failed:", error);
    }
  };

  const leaveChannel = async () => {
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (client) {
      await client.leave();
    }
    return;
  };

  return {
    client,
    joinChannel,
    leaveChannel,
    localVideoTrack,
    localAudioTrack,
  };
};

export default useAgora;
