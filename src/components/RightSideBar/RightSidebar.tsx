/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { BsSoundwave } from "react-icons/bs";
import { FaAngleLeft, FaMicrophone } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { IoMdPhotos } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import Douments from "../documents/Douments";
import VoiceList from "../Voice/VoiceList";
import Links from "../Links/Links";
import Members from "../Members/Members";
import Peoples from "../icon/Peoples";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import blankImage from "@/assets/image.png";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  useClearChannelMutation,
  useGetChanelByIdQuery,
} from "@/redux/api/channel";
import Swal from "sweetalert2";
import Photos from "../photos/Photos";
import ModalComponent from "./modal";
import plus from "@/assets/Vector.svg";

interface RightSidebarProps {
  toggleSidebar: () => void;
  id: any;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ toggleSidebar }) => {
  const userdata = useSelector((state: RootState) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const role = userdata?.role;
  const { id } = useParams();

  const { data, isLoading, error } = useGetChanelByIdQuery(id);
  const [clearChannelFn] = useClearChannelMutation();

  const [tabs, setTabs] = useState("photos");

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-[360px] h-full bg-[#19232F] text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  // Handle error state
  if (error || !data) {
    return (
      <div className="w-[360px] h-full bg-[#19232F] text-white flex justify-center items-center">
        Error loading channel data.
      </div>
    );
  }

  const handleClearChannel = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await clearChannelFn(id);
          if (res?.data?.success) {
            Swal.fire({
              title: "Deleted!",
              text: res?.data?.message,
              icon: "success",
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMember = () => {
    setIsOpen(true);
  };
  return (
    <div>
      <div className="w-[360px] h-full bg-[#19232F] text-white flex flex-col z-50">
        {/* Top Section */}
        <div className="flex items-center gap-5 pt-[26px] pb-[20px] px-4 border border-[#3A3A3A]">
          <button onClick={toggleSidebar}>
            <FaAngleLeft className="text-[#D1B206] text-[25px]" />
          </button>
          <h1 className="text-[#FFFFFF] text-xl truncate">
            {data?.result.chanelName || "Channel Name"}
          </h1>
        </div>
        {/* <Divider className="m-0" style={{ borderColor: "#475467" }} /> */}

        {/* Channel Info Section */}
        <div className="p-4 bg-[#1F242F]">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] bg-gray-600 rounded-full">
              <Image
                src={data.result.chanelImage || blankImage}
                alt="Channel"
                width={100}
                height={100}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h1 className="text-xl font-semibold text-white">
              {data.result.chanelName || "Channel Name"}
            </h1>
          </div>

          <p className="mt-2 mb-5 text-justify text-sm text-[#CECFD2]">
            {data.result.description}
          </p>

          {/* Link Section */}
          <div className="flex flex-col mb-5">
            <a
              href={data.result.traderLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-[#FFFFFF]"
            >
              {data.result.traderLink || "No trader link available"}
              <FiLink className="text-xl hover:text-[#D1B206] transition-colors duration-300 ease-in-out" />
            </a>
          </div>

          {/* Admin Controls */}
          {role === "SUPER_ADMIN" && (
            <div className="mb-5">
              <button
                onClick={handleAddMember}
                className="flex items-center gap-2"
              >
                <Image
                  src={plus}
                  alt="pin"
                  className="h-4 w-4 "
                  height={200}
                  width={200}
                />
                <span className="hover:text-[#D1B206] transition-colors duration-300 ease-in-out">
                  Add New Member
                </span>
              </button>
            </div>
          )}

          {/* Tabs Section */}
          <div className="flex items-center justify-between mt-6">
            <div>
              <div className="flex items-center gap-4">
                {/* Photos Tab */}
                <button onClick={() => setTabs("photos")} className="relative">
                  <IoMdPhotos
                    className={`text-[25px] ${
                      tabs === "photos" ? "text-[#D1B206]" : "text-white"
                    }`}
                  />
                  {tabs === "photos" && (
                    <span className="absolute bottom-0 left-0 w-full border-b-2 border-[#D1B206] translate-y-[8px]"></span>
                  )}
                </button>

                {/* Documents Tab */}
                <button
                  onClick={() => setTabs("documents")}
                  className="relative"
                >
                  <IoDocumentTextOutline
                    className={`text-[25px] ${
                      tabs === "documents" ? "text-[#D1B206]" : "text-white"
                    }`}
                  />
                  {tabs === "documents" && (
                    <span className="absolute bottom-0 left-0 w-full border-b-2 border-[#D1B206] translate-y-[8px]"></span>
                  )}
                </button>

                {/* Voice Tab */}
                <button onClick={() => setTabs("voice")} className="relative">
                  <FaMicrophone
                    className={`text-[25px] ${
                      tabs === "voice" ? "text-[#D1B206]" : "text-white"
                    }`}
                  />
                  {tabs === "voice" && (
                    <span className="absolute bottom-0 left-0 w-full border-b-2 border-[#D1B206] translate-y-[8px]"></span>
                  )}
                </button>

                {/* Links Tab */}
                <button onClick={() => setTabs("links")} className="relative">
                  <BsSoundwave
                    className={`text-[25px] ${
                      tabs === "links" ? "text-[#D1B206]" : "text-white"
                    }`}
                  />
                  {tabs === "links" && (
                    <span className="absolute bottom-0 left-0 w-full border-b-2 border-[#D1B206] translate-y-[8px]"></span>
                  )}
                </button>

                {/* Members Tab */}
                {role === "SUPER_ADMIN" && (
                  <button
                    onClick={() => setTabs("people")}
                    className="relative"
                  >
                    <Peoples color={tabs === "people" ? "#D1B206" : "white"} />
                    {tabs === "people" && (
                      <span className="absolute bottom-0 left-0 w-full border-b-2 border-[#D1B206] translate-y-[8px]"></span>
                    )}
                  </button>
                )}
              </div>
            </div>
            <button onClick={handleClearChannel} className="">
              Clear Channel
            </button>
          </div>
        </div>

        {/* Conditional Tab Rendering */}
        {tabs === "photos" && <Photos />}
        {tabs === "documents" && <Douments />}
        {tabs === "voice" && <VoiceList />}
        {tabs === "links" && <Links />}
        {tabs === "people" && <Members />}

        {isOpen && (
          <ModalComponent
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            channelId={id}
          />
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
