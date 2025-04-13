/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React from "react";
import AudioCard from "./VoiceCard";
import FileCard from "./FileCard";
// import { ChatMessageProps } from "@/Types/Chat";

interface ReplyMessageProps {
  // name: string;
  replayMessage: { message: string; files?: any[] };
  isWebmAudio: (file: any) => boolean;
  isImage: (file: any) => boolean;
}

const ReplyMessageCard: React.FC<ReplyMessageProps> = ({
  // name,
  replayMessage,
  isWebmAudio,
  isImage,
}) => {
  return (
    <div className="mb-2 p-2  placeholder: bg-gray-800 rounded-lg border border-gray-600">
      <div className="flex gap-2 items-stretch">
        <div className=" w-[2px] bg-[#D1B206] flex-shrink-0 "></div>
        <div>
          {/* <h4 className="text-sm font-medium text-[#D1B206]">{name}</h4> */}
          <p
            className="text-xs font-medium text-gray-300 break-words line-clamp-3"
            dangerouslySetInnerHTML={{ __html: replayMessage?.message }}
          ></p>
        </div>
      </div>

      {replayMessage?.files && replayMessage?.files?.length > 0 && (
        <div className="flex flex-col mt-2">
          {isImage(replayMessage?.files[0]) ? (
            <Image
              src={replayMessage?.files[0]}
              alt="file"
              height={200}
              width={200}
              className="h-[50px] w-[50px] z-0 overflow-hidden"
            />
          ) : isWebmAudio(replayMessage?.files[0]) ? (
            <AudioCard url={replayMessage?.files[0]} />
          ) : (
            <FileCard url={replayMessage?.files[0]} />
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyMessageCard;
