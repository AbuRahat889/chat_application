// import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";
import ReduxStoreProvider from "@/redux/ReduxStoreProvider";
import { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import background from "@/assets/chat-bg.svg";
import { Toaster } from "react-hot-toast";
// import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import AgoraClient from "@/components/AgoraProvaider/agora";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "360Trader",
  description:
    "At 360 we aim for perfection and we believe personal interaction is crucial to make sure we achieve our objective. We endeavor to grow your portfolio and have decided to take on a mission to teach Trading skills that will help you every step of the way on your journey to Financial freedom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <html lang="en" >
      <body className={`${poppins.variable} antialiased`}>
        <ReduxStoreProvider>
          <Providers>
            <Toaster />
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div
                className=" flex-1 overflow-y-auto bg-primary "
                style={{
                  backgroundImage: `url(${background.src})`,
                }}
              >
                <AgoraClient>{children}</AgoraClient>
              </div>
            </div>
          </Providers>
        </ReduxStoreProvider>
      </body>
    </html>
  );
}
