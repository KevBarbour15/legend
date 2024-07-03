import type { Metadata } from "next";
import Head from "next/head";
import { Inter } from "next/font/google";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import "./globals.css";

import { connectToMongoDB } from "@/lib/db";

import gsap from "gsap";
import { SplitText } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  gsap.registerPlugin(SplitText, ScrollTrigger);
  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
