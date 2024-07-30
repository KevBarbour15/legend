import React,{use, useEffect} from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Playlist from "@/components/playlist/Playlist";
import "./globals.css";

import { connectToMongoDB } from "@/lib/db";

import gsap from "gsap";
import { SplitText } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legend Has It",
  description: "Legend Has It... a new hi-fi bar is coming soon to Sacramento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // connect to MongoDB
    connectToMongoDB();
  
  // register GSAP plugins
  gsap.registerPlugin(SplitText, ScrollTrigger, Draggable);
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
          <Footer />
        </body>
      </html>
    </>
  );
}
