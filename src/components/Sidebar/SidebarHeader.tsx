import React from "react";
import Image from "next/image";
import bellImage from "@/assets/Notification.svg";
import SideBarMenu from "../AdminScreen/menu";
import Link from "next/link";

const SidebarHeader: React.FC = () => {
  return (
    <>
      <div className="flex h-[72px] items-center px-4">
        <div className="text-white cursor-pointer">
          <SideBarMenu />
        </div>
        <h2 className="flex-1 text-lg font-medium text-center text-white">
          Subscriptions
        </h2>

        <Link href={"/settings"} className="text-white ">
          <Image
            className="w-[18px] h-[20px]"
            src={bellImage}
            alt="menu"
            height={200}
            width={200}
          />
        </Link>
      </div>
    </>
  );
};

export default SidebarHeader;
