import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaFileAlt } from "react-icons/fa";
// import Link from "next/link";
import { RxCross2 } from "react-icons/rx";

interface FileCardProps {
  url: string;
}

const FileCard: React.FC<FileCardProps> = ({ url }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const modalRef = useRef<HTMLDivElement>(null); // Reference to the modal

  const isImageFile = (file: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const fileExtension = file.split(".").pop()?.toLowerCase();
    return fileExtension ? imageExtensions.includes(fileExtension) : false;
  };

  const handleImageDownload = () => {
    const link = document.createElement("a");
    const fileName = url.split("/").pop() || "image";
    link.href = url;
    link.download = fileName; // Download the image with its file name
    document.body.appendChild(link);
    link.target = "_blank";
    link.click();
    document.body.removeChild(link);
  };

  const handlePDFDownload = () => {
    const link = document.createElement("a");
    const fileName = url.split("/").pop() || "document.pdf";
    link.href = url;
    link.download = fileName; // Download the PDF with its file name
    document.body.appendChild(link);
    link.target = "_blank";
    link.click();
    document.body.removeChild(link);
  };

  const openModal = () => {
    setIsModalOpen(true); // Open modal when image is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  // Close modal if click happens outside of the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal(); // Close modal if clicked outside
      }
    };

    // Add event listener when the modal is open
    if (isModalOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    // Clean up the event listener when the modal is closed or component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="rounded-md mt-2 cursor-pointer bg-[#19232f]">
      <div className="flex items-center text-white">
        {isImageFile(url) ? (
          <div className="">
            <Image
              src={url}
              alt="image preview"
              height={100}
              width={100}
              className="rounded-md cursor-pointer w-full"
              onClick={openModal} // Open modal when the image is clicked
            />
          </div>
        ) : (
          <div className="flex-shrink-0" onClick={handlePDFDownload}>
            <div className="bg-white rounded-full p-3">
              <FaFileAlt className="text-xl text-[#425FAD]" />
            </div>
          </div>
        )}
        <div className="ml-3 flex flex-col">
          {!isImageFile(url) && (
            <div className="">
              <p
                className="text-sm cursor-pointer text-blue-500 break-words"
                onClick={handlePDFDownload}
              >
                {url.split("/").pop()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* {!isImageFile(url) && (
        <Link target="_blank" href={url}>
          <h1 className="mt-5 text-[#D1B206]">www.boom360trader.com</h1>
        </Link>
      )} */}

      {/* Modal for showing the image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef} // Set reference to the modal container
            className="relative shadow-custom1"
          >
            <button
              className="absolute top-5 right-5 text-[#D1B206]"
              onClick={closeModal}
            >
             <RxCross2 className="size-5"/>
            </button>
            <Image
              src={url}
              alt="Modal image"
              height={500}
              width={500}
              className="rounded-md w-full"
              onClick={handleImageDownload}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileCard;
