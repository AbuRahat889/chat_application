"use client";
import React, { useState, useEffect, JSX } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CameraIcon from "../icons/CameraIcon";
import Notificationicon from "../icons/notificationicon";
import { Managebilling } from "../icons/Managebilling";
import Privacy from "../icons/Privacy";
import Terms from "../icons/Terms";
import { Questions } from "../icons/Questions";
import { Logout } from "../icons/Logout";
// Import the custom hook for Redux dispatch
import { logout } from "@/redux/features/auth/authSlice";
import { updateAvatar } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useUpdateUserImageMutation } from "@/redux/api/authApi";
// Import the logout action

interface Item {
  icon: JSX.Element;
  text: string;
  route: string;
}

const items: Item[] = [
  { icon: <Notificationicon />, text: "Notification", route: "/settings" },
  {
    icon: <Managebilling />,
    text: "Manage Billing & Subscription",
    route: "https://billing.stripe.com/p/login/4gw7tvgUv1hadVKfYY",
  },
  { icon: <Privacy />, text: "Privacy and Policy", route: "/privacypolicy" },
  { icon: <Terms />, text: "Terms & Condition", route: "/terms" },
  {
    icon: <Questions />,
    text: "Ask Question",
    route: "https://boom360trader.com/contact/",
  },
  { icon: <Logout />, text: "Log out", route: "/login" },
];

const Settingsidebar = () => {
  const dispatch = useAppDispatch(); // Initialize dispatch
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const pathname = usePathname(); // Get current pathname
  // const [image, setImage] = useState<string | null>();

  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const role = useSelector((state: RootState) => state.auth.user?.role);

  const [updateImageFn] = useUpdateUserImageMutation();



  useEffect(() => {
    // Set the selected item based on the current pathname
    const selectedIndex = items.findIndex((item) => item.route === pathname);
    setSelectedItem(selectedIndex);
  }, [pathname]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the first selected file

    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file); // Add the file to FormData

    try {
      const res = await updateImageFn(formData); // Use RTK Query's unwrap to access response data

      if (res?.data?.result) {
        // Dispatch the Redux action to update the avatar in the state
        dispatch(updateAvatar(res.data.result));
        console.log("Avatar updated successfully:", res.data.result);
      } else {
        console.error("Avatar URL not returned from server.");
      }
    } catch (error) {
      console.error("Error during avatar update:", error);
    }
  };
  const handleItemClick = (index: number, route: string): void => {
    if (route === "/login") {
      handleLogout();
    } else {
      setSelectedItem(index);
      router.push(route);
      // Navigate to the specified route
    }
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
    router.push("/login"); // Navigate to the login page
  };

  return (
    <div className="mt-12">
      {/* Back Button */}
      <div className="flex items-center mb-4 px-4 cursor-pointer">
        <div onClick={() => router.push("/")} className="text-[#D1B206]">
          <IoMdArrowRoundBack className="text-2xl" />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="relative w-[100px] h-[100px] rounded-full">
          <Avatar className="w-[100px] h-[100px]">
            <AvatarImage src={user?.avatar} alt="Profile picture" />
            <AvatarFallback />
          </Avatar>

          <div className="absolute flex cursor-pointer justify-center items-center border border-[#344054] rounded bg-[#344054] top-20 left-[60px] p-[4px]">
            <label htmlFor="upload-button" className="cursor-pointer">
              <CameraIcon />
            </label>
            <input
              id="upload-button"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e)}
            />
          </div>
        </div>
      </div>
      <div className="text-center mt-6">
        <h2 className="text-white text-[32px] font-medium font-sans">
          {role === "ADMIN" ? "Admin" : "Super Admin"}
        </h2>
        <span className="text-[#8E8E93] text-[14px] font-normal">{email}</span>
      </div>

      <div className="mt-[40px] ">
        {items.map((item, index) => (
          <div
            key={index}
            className={`hover:bg-[rgba(255,255,255,0.05)] ${
              selectedItem === index ? "bg-[rgba(255,255,255,0.05)]" : ""
            }`}
            onClick={() => handleItemClick(index, item?.route)}
          >
            <li className="flex cursor-pointer justify-start gap-2 mx-6 py-6 items-center border-b border-[#373737]">
              {item?.icon}
              <span className="text-[16px] font-normal text-white">
                {item?.text}
              </span>
            </li>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settingsidebar;
