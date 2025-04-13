/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiPlus } from "react-icons/hi";
import Image from "next/image";
import blankImage from "@/assets/image.png";
import { useGetChannelMembersQuery } from "@/redux/api/channelApi";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import { useDeleteMemberMutation } from "@/redux/api/channel";

const Members: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();

  // Fetch members using the API
  const { data, isLoading, error } = useGetChannelMembersQuery(id);
  const [removeMemberFn] = useDeleteMemberMutation();


  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-4 h-full flex justify-center items-center text-white">
        Loading members...
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="p-4 h-full flex justify-center items-center text-red-500">
        Error loading members.
      </div>
    );
  }

  const members = data?.result || [];

  // Filter members based on the search query
  const filteredMembers = members?.filter((member: any) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveMember = async (userId: any) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const res = await removeMemberFn({ userId, channelId: id });

        if (res?.data?.success) {
          Swal.fire({
            title: "Deleted!",
            text: res?.data?.message,
            icon: "success",
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 h-full">
      {/* Search Field */}
      <div className="relative w-full mb-6">
        <input
          type="text"
          placeholder="Search Member Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#333642] text-white text-sm placeholder-gray-400 py-3 pl-4 pr-10 rounded-md focus:outline-none"
        />
        <div className="absolute top-0 right-0 h-full flex items-center pr-4">
          <FiSearch className="text-yellow-400 w-5 h-5" />
        </div>
      </div>

      {/* Scrollable Members List */}
      <div className="space-y-4 overflow-y-scroll h-[400px] slim-scroll">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member: any) => (
            <div key={member.id} className="flex gap-1 break-all items-center justify-between">
              <div className="flex  items-center gap-4">
                {/* Member Avatar */}
                <Image
                  src={member.avatar || blankImage}
                  alt={member.username}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* Member Name */}
                <span className="text-sm font-medium">{member.username}</span>
              </div>

              {/* Remove Button */}
              <button onClick={() => handleRemoveMember(member.id)}>
                <HiPlus className="text-yellow-400 w-5 h-5 rotate-45" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center">No members found.</div>
        )}
      </div>
    </div>
  );
};

export default Members;
