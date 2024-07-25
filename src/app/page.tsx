"use client";
import Image from "next/image";
import Head from "next/head";
import { useRef, useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/dist/SplitText";

import Playlist from "@/components/playlist/Playlist";

export default function Home() {
  // still need to implement email form submission services
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [email, setEmail] = useState<string>("");

  useGSAP(() => {}, []);

  const subscribeEmail = () => {
    alert(`Thank you for subscribing with ${email}!`);

    try {
      const response = fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col items-center space-y-14 pt-135">
      <div>
        <h1
          id="title"
          className="w-90vw text-center font-hypatiaBold text-4xl text-white lg:w-55vw lg:text-5xl xl:w-50vw xxl:w-45vw"
        >
          Legend Has It...a new hi-fi bar is coming soon to Sacramento
        </h1>
      </div>
      <div>
        <h2 className="w-85vw text-center font-hypatia text-2xl text-white lg:w-50vw xl:w-45vw xxl:w-40vw">
          Sign up to be the first to learn about updates on our launch and
          upcoming events!
        </h2>
      </div>

      <div>
        <form className="flex flex-col items-center" onSubmit={subscribeEmail}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
          />
          <button className="mt-7 rounded-full bg-customGold px-14 py-3.5 font-hypatia font-bold tracking-wider">
            <span className="text-sm leading-none text-white">SUBMIT</span>
          </button>
        </form>
      </div>
      <div className="flex items-center justify-between space-x-4 text-white">
        <a
          href="https://www.instagram.com/legendhasithifi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon className="h-7 w-7 text-white" />
        </a>
        <a
          href="https://www.youtube.com/@legendhasithifi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YouTubeIcon className="h-7 w-7 text-white" />
        </a>
        <a
          href="https://www.facebook.com/legendhasithifi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon className="h-7 w-7 text-white" />
        </a>
      </div>
    </main>
  );
}
