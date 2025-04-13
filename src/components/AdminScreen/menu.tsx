import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Divider } from "antd";
import menuImage from "@/assets/menu.svg";
import Image from "next/image";
import plus from "@/assets/Vector.svg";
import settings from "@/assets/settings.svg";
import Link from "next/link";
import CreateGroup from "../CreateGroup/CreatGroup";

const SideBarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="relative z-50">
      {/* Toggle Button */}
      <div className=" text-white" onClick={toggleSidebar}>
        <Image
          className="h-[18px] w-[23px] flex-shrink-0"
          src={menuImage}
          alt="menu"
          height={200}
          width={200}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#19232f] text-white shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between  border-b border-[#3A3A3A] px-[21px] py-[16px]">
          <h2 className="text-lg font-medium ">Menu</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={toggleSidebar}
          >
            <XIcon className="h-5 w-5 text-[#D1B206]" />
          </button>
        </div>

        {/* Menu Items */}

        {/* Create New Group */}
        <div className="flex gap-2 items-center  cursor-pointer pt-[31px] pb-[31px] pl-[16px] ">
          <Image
            src={plus}
            alt="pin"
            className="h-4 w-4 "
            height={200}
            width={200}
          />
          <div onClick={showModal}>
            <span className="text-base font-medium hover:text-[#D1B206] transition-colors duration-300 ease-in-out">
              Create New Group
            </span>
          </div>
        </div>
        <Divider
          className="m-0 p-0"
          style={{ borderColor: "#475467" }}
        ></Divider>

        <div className="py-[31px] pl-[54px] cursor-pointer hover:bg-[#FFFFFF0D]">
          <div className="text-base font-medium">Home</div>
        </div>
        <Divider
          className="m-0 p-0"
          style={{ borderColor: "#475467" }}
        ></Divider>

        <div className="text-base font-medium flex gap-2 items-center py-[31px] pl-[20px] hover:bg-[#FFFFFF0D]">
          <Image
            src={settings}
            alt="settings"
            className="h-[22px] w-[22px]"
            height={200}
            width={200}
          />
          <Link href={"/settings"}>
            <span className="text-base font-medium">Settings</span>
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <CreateGroup
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default SideBarMenu;
