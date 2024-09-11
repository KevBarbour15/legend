import Head from "next/head";
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
    url: "https://your-site.com",
    siteName: "Legend Has It",
    images: [
      {
        url: "/images/carousel/2.jpg",
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
    images: ["/images/carousel/2.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Legend Has It</title>
        </Head>
        <body className={inter.className}>
          <BackgroundOverlay />
          {children}
          <MusicPlayer tracks={tracks} />
        </body>
      </html>
    </>
  );
}
