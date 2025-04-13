"use client";
import React, { useState } from "react";
import { useGetChannelFilesQuery } from "@/redux/api/channelApi";
import { useParams } from "next/navigation";

// AudioCard Component
interface AudioCardProps {
  url: string; // URL of the audio file
}

const AudioCard: React.FC<AudioCardProps> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset audio to the beginning
    }
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-6 mb-4">
      {/* Play/Pause Button */}
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full bg-[#D1B206] cursor-pointer transition-colors duration-300 ${
          isPlaying ? "hover:bg-[#D1B206]" : "bg-white hover:bg-gray-200"
        }`}
        onClick={handlePlayPause}
      >
        {isPlaying ? (
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
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-[#D1B206]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </div>

      {/* Animated Waveform */}
      <div className="flex items-center gap-1 overflow-hidden">
        {Array(20)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`w-1 bg-[#D1B206] rounded ${
                isPlaying ? "animate-wave" : "scale-y-[0.4]"
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                height: `${Math.random() * 50 + 10}px`,
              }}
            ></div>
          ))}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={url} onEnded={handleEnded} />
    </div>
  );
};

// VoiceList Component
const VoiceList: React.FC = () => {
  const { id } = useParams();
  const { data: channelLinks, isLoading } = useGetChannelFilesQuery(id);
  const voices = channelLinks?.result?.filter((file: string) =>
    file.endsWith(".webm")
  );

  console.log(voices, "this is voices from side bar");

  return (
    <div className="p-4 h-[470px] overflow-y-scroll slim-scroll">
      {isLoading ? (
        <p className="text-gray-500 text-center">Loading voice recordings...</p>
      ) : voices && voices.length > 0 ? (
        voices.map((voice: string, index: number) => (
          <AudioCard key={index} url={voice} />
        ))
      ) : (
        <p className="text-gray-500 text-center">No voice recordings found.</p>
      )}
    </div>
  );
};

export default VoiceList;
