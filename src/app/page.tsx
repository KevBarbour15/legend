"use client";
import { useRef, useState } from "react";

import { Button, IconButton } from "@mui/material";
import { Instagram, YouTube, Facebook } from "@mui/icons-material";

import SideMenu from "@/components/side-menu/SideMenu";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
gsap.registerPlugin(SplitText);

//import Playlist from "@/components/playlist/Playlist";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // This is a temporary page so this doesn't need to be refactored
  // Other GSAP animations should be added to lib or utils folder and imported eventually
  useGSAP(() => {
    if (!containerRef.current) return;

    let split = new SplitText("#header-1", { type: "words", opacity: 0 });

    gsap.set("#header", { opacity: 0 });
    gsap.set(split.words, { scale: 1.15, opacity: 0 });
    gsap.set("#header-2", { opacity: 0 });
    gsap.set("#subheader", { opacity: 0 });
    gsap.set("#form", { opacity: 0 });
    gsap.set("#icons svg", { opacity: 0, scale: 0.5 });

    tl.current = gsap
      .timeline()
      .to("#header", {
        duration: 0.001,
        opacity: 1,
      })
      .to(
        split.words,
        {
          duration: 0.35,
          opacity: 1,
          scale: 1,
          ease: "linear",
          stagger: 0.1,
        },
        0.35,
      )
      .to(
        "#header-2",
        {
          duration: 0.45,
          opacity: 1,
        },
        0.85,
      )
      .to(
        "#subheader",
        {
          duration: 0.45,
          opacity: 1,
        },
        0.95,
      )
      .to(
        "#form",
        {
          duration: 0.45,
          opacity: 1,
        },
        0.95,
      )
      .to(
        "#icons svg",
        {
          duration: 0.45,
          stagger: 0.1,
          opacity: 1,
          scale: 1,
        },
        1.15,
      );
  }, []);

  const subscribeEmail = () => {
    try {
      const response = fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log(response);
      setEmail("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SideMenu />
      <main
        ref={containerRef}
        className="flex flex-col items-center space-y-14 bg-customNavy"
      >
        <div>
          <h1
            id="header"
            className="w-90vw text-center font-hypatiaBold text-4xl text-white opacity-0 lg:w-55vw lg:text-5xl xl:w-50vw xxl:w-45vw"
          >
            <span id="header-1" className="">
              Legend Has It...
            </span>
            <span id="header-2" className="">
              a new hi-fi bar is coming soon to Sacramento
            </span>
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
          <form
            className="flex flex-col items-center"
            onSubmit={subscribeEmail}
          >
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
            />
            <Button
              id="form-button"
              className="mt-7 rounded-full bg-customGold px-14 py-3.5 font-hypatia font-bold tracking-wider ring-2 ring-customGold hover:ring-2 hover:ring-customWhite"
            >
              <span className="text-sm leading-none text-white">SUBMIT</span>
            </Button>
          </form>
        </div>
        <div id="icons" className="flex items-center justify-between space-x-4">
          <IconButton
            href="https://www.instagram.com/legendhasithifi/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-all hover:text-customGold focus:text-customGold"
          >
            <Instagram className="v opacity-0" />
          </IconButton>
          <IconButton
            href="https://www.youtube.com/@legendhasithifi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-all hover:text-customGold focus:text-customGold"
          >
            <YouTube className="h-7 w-7 opacity-0" />
          </IconButton>

          <IconButton
            href="https://www.facebook.com/legendhasithifi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-all hover:text-customGold focus:text-customGold"
          >
            <Facebook className="h-7 w-7 opacity-0" />
          </IconButton>
        </div>
      </main>
    </>
  );
}
