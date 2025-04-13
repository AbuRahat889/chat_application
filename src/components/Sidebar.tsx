/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Divider, Spin } from "antd"; // Using Ant Design's Spin for the loading indicator
import { cn } from "@/lib/utils";
import Settingsidebar from "./settings/SettingsSidebar";
import SidebarHeader from "./Sidebar/SidebarHeader";
import SubscriptionItem from "./Sidebar/SubscriptionItem";
import { useGetAllGroupQuery } from "@/redux/api/groupApi";
import { toast, ToastContainer } from "react-toastify";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading, error } = useGetAllGroupQuery({});
  const subscriptions = data?.result || [];

  useEffect(() => {
    if (/^\/(login)/.test(pathname)) {
      return;
    }

    if ((error as any)?.status === 408) {
      // window.location.replace("/login");
      toast("Your Session is time Out");

      router.push("/login");
    }
  }, [error, router, pathname]);

  if (/^\/(login)/.test(pathname)) {
    return null;
  }

  const isMainPage =
    pathname === "/" ||
    pathname.startsWith("/channel") ||
    pathname === "/creategroup" ||
    pathname === "/createchannel" ||
    pathname === "/agoraVideoCall";

  const isSettingsPage =
    pathname === "/settings" ||
    pathname === "/privacypolicy" ||
    pathname === "/managebilling" ||
    pathname === "/questions" ||
    pathname === "/terms";

  return (
    <div
      className={cn(
        "flex min-h-screen w-80 flex-col bg-[#19232F] transition-all duration-300"
      )}
    >
      <ToastContainer />
      {isMainPage && (
        <>
          <SidebarHeader />

          <Divider className="m-0" style={{ borderColor: "#3A3A3A" }} />
          <div className="flex-1 overflow-y-auto slim-scroll">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spin size="large" tip="Loading..." /> {/* Loading Spinner */}
              </div>
            ) : (
              <div className="">
                {subscriptions.map((subscription: any) => (
                  <SubscriptionItem
                    id={subscription.id}
                    key={subscription.id}
                    subscription={subscription}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      {isSettingsPage && <Settingsidebar />}
    </div>
  );
}

export default Sidebar;
