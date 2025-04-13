import React, { useState, useRef, useEffect } from "react";

interface AudioCardProps {
  url: string; // URL of the audio file
}

const AudioCard: React.FC<AudioCardProps> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (url) {
      setCurrentUrl(url);
    }
  }, [isPlaying, url]);

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

      if (audioDuration && audioDuration !== Infinity) {
        // Set a timeout to stop the audio if duration is valid
        setTimeout(() => {
          stopAudio();
        }, audioDuration * 1000); // Convert seconds to milliseconds
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset audio to the beginning
    }
    setIsPlaying(false);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (duration === Infinity) {
        console.warn(
          "Audio duration is Infinity. Please check the audio file."
        );
      }
      setAudioDuration(duration); // Set duration (may be Infinity)
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false); // Reset state when audio ends
  };

  return (
    <div className="flex items-center gap-6 ">
      {/* Play Button */}
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full bg-[#D1B206] cursor-pointer ${
          isPlaying ? "hover:bg-[#D1B206]" : "bg-white hover:bg-white"
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

      {/* Waveform */}
      <div className="flex items-center gap-1 overflow-hidden z-0">
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
                height: `${Math.random() * 50 + 10}px`, // Random height for each bar
              }}
            ></div>
          ))}
      </div>

      {/* Hidden Audio Element */}

      <audio
        ref={audioRef}
        src={(currentUrl as string) && (currentUrl as string)}
        onLoadedMetadata={handleLoadedMetadata} // Load metadata to get duration
        onEnded={handleEnded} // Reset state when audio ends
      />
    </div>
  );
};

export default AudioCard;
