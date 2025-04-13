/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import arrow from "@/assets/arrow.svg";
import fileIcon from "@/assets/input/file.svg";
import media from "@/assets/input/media.svg";
import mic from "@/assets/input/mic.svg";
import straming from "@/assets/input/strim.svg";
import { cn } from "@/lib/utils";
import { useGetChanelByIdQuery } from "@/redux/api/channel";
import { useCreateTokenMutation } from "@/redux/api/generateToken";
import { RootState } from "@/redux/store";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { LiaPlusSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import Crossicon from "../icons/Crossicon";

import {
  clearAppInfo,
  setAppInfo,
} from "@/redux/features/agoraSlice/agoraSlice";
import { FaFileAlt } from "react-icons/fa";

import "suneditor/dist/css/suneditor.min.css";
import { setContent } from "@/redux/features/editorSlice/editorSlice";
import { setChatValues } from "@/redux/features/optimistic/opmisticSlice";
import dynamic from "next/dynamic";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: (formData: FormData) => void;
  editingMessageId: string | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  channelId: string | string[] | undefined;
  replyToMessageId: string;
  handleStream: (status: boolean) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  editingMessageId,
  isOpen,
  setIsOpen,
  channelId,
  replyToMessageId,
  handleStream,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null | string>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // const [optimisticMessage, setOptimisticMessage] = useState<string | null>(
  //   null
  // );

  // Initialize optimisticMessage from localStorage
  // useEffect(() => {
  //   const storedMessage = localStorage.setItem("optimisticMessage");
  //   if (storedMessage) {
  //     setOptimisticMessage(storedMessage);
  //   }
  // }, []);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // const currentUser = useSelector((state: RootState) => state.auth.user);
  const id = useSelector((state: RootState) => state.auth.user?.id);

  const { data: channelInfo } = useGetChanelByIdQuery(channelId);
  const [strimTokenFn] = useCreateTokenMutation({});
  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;

  const content = useSelector((state: any) => state?.editor?.content);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setContent(newMessage));
  }, [newMessage, dispatch]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const file = new File([audioBlob], `recording${id + Date.now()}.webm`, {
          type: "audio/webm",
        });
        setSelectedFile(file);
        setIsRecording(false);
      };

      mediaRecorder.start();

      setIsRecording(true);

      //set recording time
      setRecordingTime(0); // Reset recording time
      const interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerInterval(interval);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
      setSelectedFile(null);
      setIsRecording(false);

      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  // Helper function to format time as MM:SS
  const formatTime = (time: any) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() && !selectedFile) return;

    dispatch(
      setChatValues({
        searchQuery: "",
        isMultiSelectActive: false,
        // files: selectedFile,
        name: "",
        department: "",
        messageId: "",
        message: newMessage,
        createdAt: "",
        isSender: false,
        avatar: "",
        replyMsgId: "",
        isStreamingStatus: true,
      })
    );

    const formData = new FormData();

    if (replyToMessageId && newMessage.trim()) {
      formData.append(
        "bodyData",
        JSON.stringify({ message: newMessage, replyId: replyToMessageId })
      );
    } else {
      formData.append("bodyData", JSON.stringify({ message: newMessage }));
    }

    if (selectedFile) formData.append("sendFiles", selectedFile);

    // Handle the send message logic
    handleSendMessage(formData);

    // Update UI with the optimistic message
    // setOptimisticMessage(optimisticData);

    // Clear input fields
    setNewMessage("");
    setSelectedFile(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  useEffect(() => {
    const generateTokenAgora = async () => {
      const randomUid = Math.floor(Math.random() * 1000000);
      // const randomUid = channelInfo?.result?.id;

      console.warn(
        randomUid,
        channelInfo?.result?.chanelName,
        "this is channelInfo?.result?.chanelName from input message"
      );

      if (!channelInfo?.result?.chanelName) {
        console.error("Channel information is missing.");
        return;
      }

      const generateAgoraToken = {
        role: "publisher",
        uid: randomUid,
        roomId: channelInfo?.result?.chanelName,
      };

      try {
        const res = await strimTokenFn(generateAgoraToken).unwrap();
        const token = res?.result;

        if (token) {
          dispatch(
            setAppInfo({
              channelId: channelInfo?.result?.id,
              uid: randomUid,
              channelName: channelInfo?.result?.chanelName,
              token,
              appId: appId, // Replace with your actual App ID
            })
          );
        }
      } catch (error) {
        console.error("Error generating token:", error);

        // Optionally clear the store on failure
        dispatch(clearAppInfo());
      }
    };
    generateTokenAgora();
  }, [channelInfo, strimTokenFn, dispatch, appId]);

  const handleGenerateToken = async () => {
    handleStream(true);
    setIsOpen(false);
  };

  if (selectedFile) {
    setIsOpen(false);
  }

  // Function to check if the file is a .webm file (audio)
  const isWebmAudio = (selectedFile: any) => {
    if (!selectedFile) return false;

    // Check if file has a `name` property (e.g., from File API)
    if (selectedFile.name) {
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      return fileExtension === "webm";
    }

    // If file is a URL, extract extension from the URL
    if (typeof selectedFile === "string") {
      const fileExtension = selectedFile
        .split("?")[0]
        .split(".")
        .pop()
        ?.toLowerCase();
      return fileExtension === "webm";
    }

    return false;
  };
  return (
    <div className="flex flex-col">
      {selectedFile && (
        <div className="flex items-center  justify-between gap-5 ml-20 py-5 px-3 bg-[#1E2A38] rounded-md text-white z-50 mr-20">
          <div className=" w-[2px] bg-[#D1B206] flex-shrink-0 "></div>
          <div className="flex-1 mt-1">
            {selectedFile instanceof File &&
            selectedFile.type.startsWith("image/") ? (
              <div className="flex items-center gap-4 w-full">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-16 h-16 rounded-md "
                  height={200}
                  width={200}
                />
                <span>{selectedFile?.name}</span>
              </div>
            ) : selectedFile instanceof File ? (
              <span className=" text-wrap break-all">
                {isWebmAudio(selectedFile) ? (
                  <div className="flex gap-3 items-center">
                    <div className="bg-[#D1B206] rounded-full p-1">
                      <Image
                        src={mic}
                        alt="mic"
                        width={20}
                        height={20}
                        className={cn(`h-[29px] w-[29px]  `)}
                      />
                    </div>
                    <h1>{selectedFile?.name}</h1>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center">
                    <div className="bg-white rounded-full p-3">
                      <FaFileAlt className="text-xl text-[#425FAD]" />
                    </div>
                    <h1>{selectedFile?.name}</h1>
                  </div>
                )}
              </span>
            ) : (
              <span className="text-wrap flex flex-wrap  break-all">
                Link: {selectedFile}
              </span>
            )}
          </div>

          <div className="cursor-pointer" onClick={() => setSelectedFile(null)}>
            <Crossicon />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex items-center px-6 py-3 bg-[#19232F] mx-20 mb-[26px]"
        )}
      >
        <div
          className="relative py-2 w-[29px] h-[29px] border border-[#D1B206] rounded-full flex items-center justify-center cursor-pointer"
          ref={dropdownRef}
        >
          <LiaPlusSolid
            onClick={() => setIsOpen(!isOpen)}
            className={`text-[#D1B206] transition-transform duration-500 ease-in-out ${
              isOpen ? "rotate-[225deg]" : "rotate-0"
            }`}
          />

          {isOpen && (
            <div className="absolute -left-6 bottom-12 z-20 w-72 bg-[#19232F] rounded-md">
              <div className="flex flex-col">
                <div>
                  {/* Recording Button */}
                  <div
                    className="flex gap-3 items-center cursor-pointer hover:bg-[#FFFFFF0D] transition-colors duration-300 ease-in-out pl-6 pt-4 pb-2"
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    <Image
                      src={mic}
                      alt="mic"
                      width={20}
                      height={20}
                      className={cn(
                        `h-[29px] w-[29px] ${isRecording ? "hidden" : ""}`
                      )}
                    />
                    <span className="text-xl pb-2 font-medium">
                      {isRecording ? (
                        <div className="flex gap-2 items-center h-5">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full bg-red-600 cursor-pointer ${
                              isRecording ? "" : "bg-white hover:bg-white"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="6" y="7" width="4" height="10"></rect>
                              <rect x="14" y="7" width="4" height="10"></rect>
                            </svg>
                          </div>
                          {/* wave animation  */}
                          <div className="flex gap-5 items-center justify-between h-8   ">
                            <div className="flex items-center gap-4  w-32">
                              <div className="flex items-center gap-1 overflow-hidden z-0">
                                {Array(20)
                                  .fill(0)
                                  .map((_, index) => (
                                    <div
                                      key={index}
                                      className={`w-1 bg-red-500 rounded ${
                                        isRecording
                                          ? "animate-wave"
                                          : "scale-y-[0.4]"
                                      }`}
                                      style={{
                                        animationDelay: `${index * 0.1}s`,
                                        height: `${Math.random() * 20 + 10}px`, // Random height for each bar
                                      }}
                                    ></div>
                                  ))}
                              </div>
                            </div>
                            <div className="mt-1 text-red-600 text-sm font-extralight ">
                              {formatTime(recordingTime)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        "Record Voice"
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pl-6 py-2 items-center hover:bg-[#FFFFFF0D] transition-colors duration-300 ease-in-out">
                  <Image
                    src={media}
                    alt="media"
                    width={20}
                    height={20}
                    className="h-[29px] w-[29px]"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="text-xl font-medium cursor-pointer"
                  >
                    Upload Media
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="flex gap-3 pl-6 py-2 items-center hover:bg-[#FFFFFF0D] transition-colors duration-300 ease-in-out">
                  <Image
                    src={fileIcon}
                    alt="file"
                    width={20}
                    height={20}
                    className="h-[25px] w-[25px]"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="text-xl font-medium cursor-pointer"
                  >
                    Upload File
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                <div
                  onClick={() => {
                    handleGenerateToken();
                  }}
                  className="flex gap-3 pl-6 pt-2 pb-4 items-center text-xl font-medium cursor-pointer hover:bg-[#FFFFFF0D] transition-colors duration-300 ease-in-out"
                >
                  <Image
                    src={straming}
                    alt="strim"
                    width={20}
                    height={20}
                    className="h-[29px] w-[29px]"
                  />
                  Start Live Streaming
                </div>
              </div>
            </div>
          )}
        </div>

        <SunEditor
          setOptions={{
            mode: "inline",
            buttonList: [],
            font: ["Poppins", "Poppins Fallback"],
            height: "50px",
          }}
          setContents={content}
          onChange={(e) => setNewMessage(e)}
          placeholder={editingMessageId ? "Edit message..." : "Message..."}
        />

        <button
          onClick={sendMessage}
          className="w-8 h-8 flex items-center justify-center rounded-full"
        >
          <Image src={arrow} alt="Send" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
