"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Divider } from "antd";
import blankImage from "@/assets/image.png";
import { TiPin } from "react-icons/ti";
import { BsPlusLg } from "react-icons/bs";
import { cn } from "@/lib/utils";
import Createphoto from "../createchannel/Createphoto";

interface Channel {
  id: string;
  chanelImage: string;
  chanelName: string;
  description: string;
  updatedAt: string;
  memberIds: string[];
}

interface SubscriptionItemProps {
  id: string;
  subscription: {
    groupImage: string;
    groupName: string;
    chanel: Channel[];
    updatedAt: string;
  };
}

const SubscriptionItem: React.FC<SubscriptionItemProps> = ({
  subscription,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>(subscription.chanel);
  const [pinnedChannelIds, setPinnedChannelIds] = useState<string[]>([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Load pinned channels from localStorage on mount
  useEffect(() => {
    const savedPinnedChannelIds = JSON.parse(
      localStorage.getItem("pinnedChannelIds") || "[]"
    );
    setPinnedChannelIds(savedPinnedChannelIds);

    // Reorder channels with pinned ones at the top
    setChannels((prevChannels) => {
      const pinnedChannels = prevChannels.filter((ch) =>
        savedPinnedChannelIds.includes(ch.id)
      );
      const otherChannels = prevChannels.filter(
        (ch) => !savedPinnedChannelIds.includes(ch.id)
      );
      return [...pinnedChannels, ...otherChannels];
    });
  }, [subscription.chanel]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // Pin or unpin a channel
  const togglePinChannel = (channelId: string) => {
    setPinnedChannelIds((prevPinned) => {
      let updatedPinned;
      if (prevPinned.includes(channelId)) {
        // Unpin the channel
        updatedPinned = prevPinned.filter((id) => id !== channelId);
      } else {
        // Pin the channel
        updatedPinned = [...prevPinned, channelId];
      }
      // Update localStorage
      localStorage.setItem("pinnedChannelIds", JSON.stringify(updatedPinned));

      // Reorder channels
      setChannels((prevChannels) => {
        const pinnedChannels = prevChannels.filter((ch) =>
          updatedPinned.includes(ch.id)
        );
        const otherChannels = prevChannels.filter(
          (ch) => !updatedPinned.includes(ch.id)
        );
        return [...pinnedChannels, ...otherChannels];
      });

      return updatedPinned;
    });
  };

  return (
    <div className="m-0">
      <button
        onClick={toggleMenu}
        className={cn(
          `group flex w-full items-center gap-3 px-3 text-left py-5 hover:bg-[#FFFFFF0D] transition-colors duration-300 ease-in-out ${
            isOpen ? " z-50 shadow-custom" : ""
          }`
        )}
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
          <Image
            src={subscription?.groupImage}
            alt={subscription?.groupName}
            className="h-14 w-14 rounded-full object-cover"
            height={200}
            width={200}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="truncate text-sm font-medium text-white">
            {subscription.groupName}
          </div>
          <div className="truncate text-sm text-white/60">
            Total {subscription.chanel.length} channel(s)
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-normal text-white/40">
            {new Date(subscription?.updatedAt).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-white/40 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <div
        className={`transition-all duration-800 overflow-hidden ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="rounded-lg shadow-md">
          <ul className="text-sm text-white/70">
            {channels.length === 0 ? (
              <div className="animate-pulse">
                <h1 className="ml-14 py-4">No Channel Here</h1>
              </div>
            ) : (
              channels.map((channel: Channel) => (
                <div
                  key={channel.id}
                  className="cursor-pointer hover:bg-[#FFFFFF0D] transition-colors duration-300 ease-in-out pl-[50px] pr-[18px]"
                >
                  <li className="pt-[26px] pb-[18px]">
                    <Link href={`/channel/${channel.id}`}>
                      <div className="flex gap-2 items-center">
                        <Image
                          src={channel?.chanelImage || blankImage}
                          alt={channel?.chanelName}
                          className="h-12 w-12 rounded-full object-cover"
                          height={200}
                          width={200}
                        />
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-sm font-medium text-white">
                            {channel.chanelName}
                          </div>
                          <div className="truncate text-xs font-normal text-[#8E8E93]">
                            {channel.memberIds.length} subscribers
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            togglePinChannel(channel.id);
                          }}
                        >
                          <TiPin
                            className={cn(
                              `h-5 w-5 ${
                                pinnedChannelIds.includes(channel.id)
                                  ? "text-[#D1B206]"
                                  : "text-[#636366]"
                              }`
                            )}
                          />
                        </div>
                      </div>
                    </Link>
                  </li>
                  <Divider className="m-0" style={{ borderColor: "#373737" }} />
                </div>
              ))
            )}

            <li className="px-4 py-7 cursor-pointer flex gap-2 items-center">
              <BsPlusLg className="text-[#D1B206] size-4 ml-10" />
              <div
                onClick={showModal}
                className="text-white text-sm font-medium hover:text-[#D1B206] transition-colors duration-300 ease-in-out"
              >
                Create Channel
              </div>
            </li>
          </ul>
        </div>
      </div>
      <Divider className="m-0" style={{ borderColor: "#373737" }} />

      {isModalOpen && (
        <Createphoto
          id={id}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default SubscriptionItem;
