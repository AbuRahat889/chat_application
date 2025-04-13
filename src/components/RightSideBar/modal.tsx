/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useAddMemberMutation,
  useGetAllMemberQuery,
} from "@/redux/api/channel";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiPlus } from "react-icons/hi";
import { ToastContainer } from "react-toastify";

interface ModalComponentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  channelId: any;
}

export default function ModalComponent({
  isOpen,
  setIsOpen,
}: ModalComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useGetAllMemberQuery("");
  const [addMemberFn] = useAddMemberMutation();

  const { id } = useParams();

  //add member into channel
  const handleAddMember = async (userId: any) => {
    try {
      const res = await addMemberFn({ userId, channelId: id });

      if (res?.data?.success === true) {
        toast(res?.data?.message);
      } else {
        toast("this user already exists!");
      }
    } catch (error: any) {
      toast(error);
    }
  };

  // Filter members based on the search query
  const filteredMembers = data?.result.filter((member: any) =>
    member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex justify-center ">
      <ToastContainer />
      {isOpen && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto "
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 ">
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-[#19232F] rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <h3
                className="text-lg font-medium leading-6 capitalize text-white"
                id="modal-title"
              >
                Add New Member
              </h3>

              <form className="mt-4" action="#">
                {[...Array(1)].map((_, index) => (
                  <label
                    key={index}
                    className="block mt-3"
                    htmlFor={`email-${index}`}
                  >
                    <input
                      type="texy"
                      name={`text-${index}`}
                      id={`text-${index}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search here"
                      className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                    />
                  </label>
                ))}

                <div className="space-y-4 overflow-y-scroll h-[400px] slim-scroll mt-5 text-black">
                  {filteredMembers?.length > 0 ? (
                    filteredMembers?.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex gap-1 items-center justify-between"
                      >
                        <div className="flex items-center gap-4 break-all">
                          <Image
                            src={member.avatar}
                            alt={member.username}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />

                          <span className="text-sm font-medium text-white text-wrap break-words">
                            {member.username}
                          </span>
                        </div>

                        <button onClick={() => handleAddMember(member.id)}>
                          <HiPlus className="text-yellow-400 w-5 h-5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-center">
                      No members found.
                    </div>
                  )}
                </div>

                <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border rounded-md sm:w-1/2 sm:mx-2 bg-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
