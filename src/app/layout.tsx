import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BackgroundOverlay from "@/components/bg-overlay/BackgroundOverlay";
import MusicPlayer from "@/components/music-player/MusicPlayer";
import MobileHeader from "@/components/mobile-header/MobileHeader";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const tracks: {
  url: string;
  title: string;
  artist: string;
}[] = [
  {
    url: "./audio/love-yes.mp3",
    title: "Love Yes",
    artist: "HP Vince",
  },
  {
    url: "./audio/everlasting.mp3",
    title: "Everlasting",
    artist: "Dr. Packer",
  },
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
    url: "./audio/get-down-baby.mp3",
    title: "Get Down Baby",
    artist: "Deep & Disco",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://www.legendhasithifi.com/"),
  title: "Legend Has It",
  description:
    "Sacramento's first hi-fi listening bar, where music meets the art of sound.",
  keywords:
    "hi-fi bar Sacramento, listening bar, audiophile bar, beer bar Sacramento, vinyl bar, music venue Sacramento",

  openGraph: {
    title: "Legend Has It",
    url: "https://www.legendhasithifi.com/",
    siteName: "Legend Has It",
    description:
      "Sacramento's first hi-fi listening bar, where music meets the art of sound.",
    images: [
      {
        url: "/images/meta-image.jpg",
        width: 1200,
        height: 630,
        alt: "Legend Has It",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Legend Has It",
    images: ["/images/meta-image.jpg"],
    description:
      "Sacramento's first hi-fi listening bar, where music meets the art of sound.",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5464ff",
      },
    ],
  },
  other: {
    "instagram:site": "@legendhasithifi",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <head>
          <meta
            content="width=device-width, initial-scale=1, user-scalable=1, minimum-scale=1, maximum-scale=5"
            name="viewport"
          />
        </head>
        <body className={inter.className} suppressHydrationWarning={true}>
          <Script
            id="mcjs"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/783ca62931283b3104dae7fdb/5f76e1f7d9803b38a26cab6bc.js");`,
            }}
          />
          <Toaster />
          <BackgroundOverlay />
          <MobileHeader />
          {children}
          <MusicPlayer tracks={tracks} />
        </body>
      </html>
    </>
  );
}
