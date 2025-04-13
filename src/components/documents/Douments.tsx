import { useGetChannelFilesQuery } from "@/redux/api/channelApi";
import { useParams } from "next/navigation";
import { IoDocumentTextOutline } from "react-icons/io5";

const Documents = () => {
  const { id } = useParams();
  const { data: channelLinks, isLoading } = useGetChannelFilesQuery(id); // Add isLoading to handle loading state

  // Filter for specific file types: zip, pdf
  const filteredFiles = channelLinks?.result?.filter((file: string) =>
    /\.(zip|pdf)$/i.test(file)
  );

  const handleFileClick = (fileUrl: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop() || "download";
    link.target = "blank";
    link.click();
  };

  return (
    <div className="p-4 overflow-y-scroll h-[450px] slim-scroll">
      {isLoading ? (
        <p className="text-gray-500 text-center">Loading documents...</p>
      ) : filteredFiles && filteredFiles.length > 0 ? (
        filteredFiles.map((file: string, index: number) => (
          <div
            key={index}
            onClick={() => handleFileClick(file)}
            className="flex mb-4 items-center gap-3 rounded-lg cursor-pointer transition "
          >
            {/* Icon Section */}
            <div className="w-12 h-12  bg-white rounded-full flex items-center justify-center">
              <IoDocumentTextOutline className=" text-[#425FAD] text-2xl w-6 h-6 rounded-full" />
            </div>

            {/* Document Info Section */}
            <div>
              <h1 className="font-semibold truncate text-wrap break-words w-64 ">
                {file.split("/").pop()}
              </h1>
              <p className="text-[#8E8E93] text-sm">Click to download</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No documents found.</p>
      )}
    </div>
  );
};

export default Documents;
