"use client";
import Image from "next/image";
import Head from "next/head";
import { useRef, useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
//import { SplitText } from "gsap/dist/SplitText";

//import Playlist from "@/components/playlist/Playlist";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [email, setEmail] = useState<string>("");

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set("#header", { opacity: 0, scale: 0.75, y: 50 });
    gsap.set("#subheader", { opacity: 0, scale: 0.75, y: 50 });
    gsap.set("#form", { opacity: 0 });
    gsap.set("#icons svg", { opacity: 0, scale: 0.75 });

    tl.current = gsap
      .timeline({})
      .to(
        "#header",
        {
          duration: 0.45,
          opacity: 1,
          y: 0,
          scale: 1,
        },
        0.35,
      )
      .to(
        "#subheader",
        {
          duration: 0.45,
          opacity: 1,
          y: 0,
          scale: 1,
        },
        0.55,
      )
      .to(
        "#form",
        {
          duration: 0.35,
          opacity: 1,
          scale: 1,
        },
        0.75,
      )
      .to(
        "#icons svg",
        {
          duration: 0.35,
          stagger: 0.085,
          opacity: 1,
          scale: 1,
        },
        0.75,
      );
  }, []);

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
    <main
      ref={containerRef}
      className="flex flex-col items-center space-y-14 pt-135"
    >
      <div>
        <h1
          id="header"
          className="w-90vw text-center font-hypatiaBold text-4xl text-white opacity-0 lg:w-55vw lg:text-5xl xl:w-50vw xxl:w-45vw"
        >
          Legend Has It...a new hi-fi bar is coming soon to Sacramento
        </h1>
      </div>
      <div>
        <h2
          id="subheader"
          className="w-85vw text-center font-hypatia text-2xl text-white opacity-0 lg:w-50vw xl:w-45vw xxl:w-40vw"
        >
          Sign up to be the first to learn about updates on our launch and
          upcoming events!
        </h2>
      </div>

      <div id="form" className="opacity-0">
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
      <div
        id="icons"
        className="flex items-center justify-between space-x-4 text-white"
      >
        <a
          href="https://www.instagram.com/legendhasithifi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon className="h-7 w-7 text-white opacity-0" />
        </a>
        <a
          href="https://www.youtube.com/@legendhasithifi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YouTubeIcon className="h-7 w-7 text-white opacity-0" />
        </a>
        <a
          href="https://www.facebook.com/legendhasithifi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon className="h-7 w-7 text-white opacity-0" />
        </a>
      </div>
    </main>
  );
}
