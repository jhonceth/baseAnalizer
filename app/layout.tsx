import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MiniAppProvider } from "@/components/farcaster-provider";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZBase Analytics",
  description: "Track Zora coin - Live crypto analytics and market data",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MiniAppProvider>
          {children}
        </MiniAppProvider>
        <Toaster />
      </body>
    </html>
  );
}