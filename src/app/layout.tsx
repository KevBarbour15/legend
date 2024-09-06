import React, { use, useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BackgroundOverlay from "@/components/bg-overlay/BackgroundOverlay";
import SideMenu from "@/components/side-menu/SideMenu";
import MusicPlayer from "@/components/music-player/MusicPlayer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legend Has It",
  description: "Legend Has It... a new hi-fi bar is coming soon to Sacramento",
};

const tracks: {
  url: string;
  title: string;
  artist: string;
}[] = [
  {
    url: "./audio/do-for-love.mp3",
    title: "Do For Love",
    artist: "Get Down Edits",
  },
  {
    url: "./audio/lover-in-u.mp3",
    title: "Lover In U",
    artist: "Fig Edits",
  },
  {
    url: "./audio/love-yes.mp3",
    title: "Love Yes",
    artist: "HP Vince",
  },
  {
    url: "./audio/get-down-baby.mp3",
    title: "Get Down Baby",
    artist: "Deep & Disco",
  },
  {
    url: "./audio/everlasting.mp3",
    title: "Everlasting",
    artist: "Dr. Packer",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>
        <body className={inter.className}>
          <BackgroundOverlay />
          <SideMenu />
          {children}
        </body>
      </html>
    </>
  );
}
