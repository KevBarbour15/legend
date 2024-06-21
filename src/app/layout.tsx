import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legend Has It",
  description: "Legend Has It... a new hi-fi bar is coming soon to Sacramento",
};

// GSAP animation imports
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import SplitText from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, SplitText, CustomEase);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}