// "use client"
// import React, { useState } from "react";
// import { IoSearchOutline } from "react-icons/io5";
// import notify from "@/assets/notify.svg";
// import Image from "next/image";
// import RightSidebar from "../RightSideBar/RightSidebar";


// const TopBar = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Function to toggle the sidebar
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div>
//       {/* Top Bar */}
//       <div className="bg-[#19232F] px-6 py-[10px] flex items-center justify-between">
//         <div className="ml-20">
//           <h1 className="text-[#FFFFFF]">360 Elite Crypto Trading 1</h1>
//           <p className="text-[#8E8E93]">156 Subscription Member</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <IoSearchOutline className="text-[25px] text-[#D1B206]" />
//           <button onClick={toggleSidebar}>
//             <Image src={notify} alt="notification icon" />
//           </button>
//         </div>
//       </div>

//       {/* Right Sidebar */}
//       <div
//         className={`fixed top-0 right-0 h-full bg-[#19232F] transition-transform duration-300 ease-in-out ${
//           isSidebarOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//         style={{ width: "360px" }} 
//       >
//         <RightSidebar toggleSidebar={toggleSidebar} />
//       </div>

//       {/* Overlay for Sidebar */}
//       {/* {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={toggleSidebar}
//         ></div>
//       )} */}
//     </div>
//   );
// };

// export default TopBar;
