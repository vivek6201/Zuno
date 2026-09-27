import React from "react";
import "./globals.css";
import { Metadata } from "next";
import { Google_Sans } from "next/font/google";

const googleSans = Google_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zuno",
    template: "%s - Zuno",
  },
  description: "A Gaming platform for quick multiplayer fun.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body
        suppressHydrationWarning
        className={`${googleSans.className} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
