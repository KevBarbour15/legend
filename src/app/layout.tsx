import React, { use, useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
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
  albumArt: string;
  album: string;
}[] = [
  {
    url: "./audio/action-bronson/the-symbol.mp3",
    title: "The Symbol",
    artist: "Action Bronson",
    albumArt: "./audio/action-bronson/rare-chandeliers.jpg",
    album: "Rare Chandeliers",
  },
  {
    url: "./audio/westside-gunn/mr-t.mp3",
    title: "Mr. T",
    artist: "Westside Gunn",
    albumArt: "./audio/westside-gunn/flygod.jpg",
    album: "Flygod",
  },
  {
    url: "./audio/asap-rocky/brand-new-guy.mp3",
    title: "Brand New Guy",
    artist: "A$AP Rocky",
    albumArt: "./audio/asap-rocky/live-love-asap.jpg",
    album: "Live.Love.A$AP",
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
          <Header />
          {children}
          <MusicPlayer tracks={tracks} />
          <Footer />
        </body>
      </html>
    </>
  );
}
