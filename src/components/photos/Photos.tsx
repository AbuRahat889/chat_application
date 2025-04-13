import { useGetChannelFilesQuery } from "@/redux/api/channelApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const Photos = () => {
  const { id } = useParams();
  const { data: channelLinks, isLoading } = useGetChannelFilesQuery(id);

  // Filter for specific image file extensions
  const filteredFiles = channelLinks?.result?.filter((file: string) =>
    /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)
  );

  return (
    <div className="p-4">
      {isLoading ? (
        <p className="text-gray-500 text-center">Loading photos...</p>
      ) : filteredFiles && filteredFiles.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {filteredFiles.map((file: string, index: number) => (
            <Link
              href={file}
              key={index}
              target="-blank"
              className="rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <Image
                src={file}
                alt={`Photo ${index + 1}`}
                width={48}
                height={48}
                className="w-full h-16 object-cover rounded-sm"
              />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No photos found.</p>
      )}
    </div>
  );
};

export default Photos;
