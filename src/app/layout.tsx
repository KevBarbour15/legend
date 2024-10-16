import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import BackgroundOverlay from "@/components/bg-overlay/BackgroundOverlay";
import MusicPlayer from "@/components/music-player/MusicPlayer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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

export const metadata: Metadata = {
  metadataBase: new URL("https://legend-zg4t.vercel.app/"),
  title: "Legend Has It",
  openGraph: {
    title: "Legend Has It",
    url: "https://www.legendhasithifi.com/",
    siteName: "Legend Has It",
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Legend Has It</title>
      </head>
      <body className={inter.className}>
        <Script
          id="mcjs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/783ca62931283b3104dae7fdb/5f76e1f7d9803b38a26cab6bc.js");`,
          }}
        />
        <BackgroundOverlay />
        {children}
        <MusicPlayer tracks={tracks} />
      </body>
    </html>
  );
}
