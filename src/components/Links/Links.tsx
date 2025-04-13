import { useGetRecordQuery } from "@/redux/api/chatApi";
import { useParams } from "next/navigation";
import React from "react";
import { PiLinkSimpleBold } from "react-icons/pi";

const Links: React.FC = () => {
  // Fetch channel files using the API
  const { id } = useParams();
  const { data: channelLinks, isLoading, error } = useGetRecordQuery(id);

  console.log(channelLinks?.result, "this is channenl id ");

  // Handle loading state [0]?.recordingLin
  if (isLoading) {
    return (
      <div className="p-4 h-[470px] flex justify-center items-center text-white">
        Loading video links...
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-4 h-[470px] flex justify-center items-center text-red-500">
        Error loading video links.
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-scroll h-[470px] slim-scroll">
      {channelLinks?.result?.length > 0 ? (
        channelLinks?.result?.map(
          (
            link: { recordingLink: string; createdAt: string },
            index: number
          ) => (
            <div key={index} className="flex items-center gap-4 mb-4 ">
              {/* Link Icon */}
              <div>
                <PiLinkSimpleBold className="text-white w-6 h-6" />
              </div>

              {/* Video Link */}
              <div className="flex-1">
                <a
                  href={link?.recordingLink}
                  className="text-white hover:underline break-all text-sm line-clamp-2 hover:text-[#D1B206] transition-colors duration-300 ease-in-out"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link?.recordingLink}
                </a>
              </div>
            </div>
          )
        )
      ) : (
        <div className="text-base text-gray-500 text-center">
          No Streaming found.
        </div>
      )}
    </div>
  );
};

export default Links;
