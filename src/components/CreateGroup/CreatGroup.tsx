"use client";
import CameraIcon2 from "@/components/icons/CameraIcon2";
import { useCreateGroupMutation } from "@/redux/api/groupApi";
import { Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

interface CreatePhotoProps {
  isModalOpen: boolean; // Controls modal visibility
  setIsModalOpen: (isOpen: boolean) => void;
}

const CreateGroup: React.FC<CreatePhotoProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const route = useRouter();

  interface FormData {
    name: string;
  }

  const [newGroupFN] = useCreateGroupMutation({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(e.target.files);
    if (file) {
      setImage(file);
      // Generate a preview URL for the image
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    formData.append("bodyData", JSON.stringify({ groupName: data.name }));
    if (image) {
      formData.append("groupImage", image);
    }

    try {
      const res = await newGroupFN(formData);

      if (res?.data?.success) {
        toast("Group Create Successfully!");
        reset();
        setImagePreview(null);
        route.push("/");
      }
    } catch (error) {
      console.error("Error:", error);
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
      className="flex h-screen justify-center items-start"
      closeIcon={
        <span style={{ color: "#FFD700", fontSize: "30px" }}>×</span> // Customize close button color and style
      }
    >
      <div className="flex  items-center justify-center ">
        <ToastContainer />
        <div className="bg-[#19232F] px-6 md:h-[737.5px] flex flex-col justify-start items-center">
          <p className="text-2xl mt-6 mb-20 font-normal text-white">
            Create Group
          </p>
          <label className="bg-white rounded-full p-[81px] flex justify-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
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
                placeholder="Name here"
                className="w-[540px] mb-6 placeholder:text-center max-w-[480px] px-4 py-3 rounded bg-white text-[#19232F] placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="w-[540px] max-w-[480px] px-4 py-3 rounded bg-[#FFD700] text-[#19232F] font-medium hover:bg-[#FFE44D] transition-colors"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroup;
