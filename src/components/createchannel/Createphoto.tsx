/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CameraIcon2 from "@/components/icons/CameraIcon2";
import { useCreateChanelMutation } from "@/redux/api/channel";
import { Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

// Define the types for form data
interface FormData {
  name: string;
  description: string;
}

interface CreatePhotoProps {
  id: string; // Ensure `id` is passed as a prop
  isModalOpen: boolean; // Controls modal visibility
  setIsModalOpen: (isOpen: boolean) => void;
}

const Createphoto: React.FC<CreatePhotoProps> = ({
  id,
  isModalOpen,
  setIsModalOpen,
}) => {
  const route = useRouter();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [channelInfoFN] = useCreateChanelMutation();

  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  // Form submission
  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append(
      "bodyData",
      JSON.stringify({
        chanelName: data.name,
        description: data.description,
        traderLink: "sli.com",
      })
    );
    if (image) {
      formData.append("chanelImage", image);
    }

    try {
      const response: any = await channelInfoFN({ id, formData }).unwrap();
      if (response?.success) {
        toast.success("Channel created successfully!");
        reset(); // Reset form fields
        setImage(null); // Reset image state
        setImagePreview(null); // Clear image preview
        route.push(`/channel/${response?.result?.id}`); // Navigate to created channel
        setIsModalOpen(false);
      } else {
        toast.error("Failed to create channel. Please try again.");
      }
    } catch (error) {
      console.error("Error creating channel:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // If the modal is not open, do not render the content
  if (!isModalOpen) {
    return null;
  }

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={false}
      className="flex  items-start justify-center "
      closeIcon={
        <span style={{ color: "#FFD700", fontSize: "30px" }}>×</span> // Customize close button color and style
      }
    >
      <ToastContainer />
      <div className="bg-[#19232F] px-6 pb-6 flex flex-col justify-start items-center ">
        <p className="text-2xl mt-6 mb-20 font-normal text-white">
          Create Channel
        </p>
        <label className="bg-white rounded-full p-[81px] flex justify-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {imagePreview ? (
            <Image
              src={imagePreview}
              width={200}
              height={200}
              alt="Uploaded"
              className="w-[202px] h-[202px] rounded-full object-cover"
            />
          ) : (
            <CameraIcon2 />
          )}
        </label>
        <form className="mt-20" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="Channel Name"
              className="w-[540px] mb-6 placeholder:text-center max-w-[480px] px-4 py-3 rounded bg-white text-[#19232F] placeholder:text-gray-500"
            />
            <input
              {...register("description", { required: true })}
              type="text"
              placeholder="Description"
              className="w-[540px] mb-6 max-w-[480px] placeholder:text-[#FFFFFF33] px-4 py-3 rounded bg-[#0C101C] text-white placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="w-[540px] max-w-[480px] px-4 py-3 rounded bg-[#FFD700] text-[#19232F] font-medium hover:bg-[#FFE44D] transition-colors"
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Createphoto;
