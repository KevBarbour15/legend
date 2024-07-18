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
          className="font-hypatiaBold text-4xl lg:text-5xl text-white text-center w-90vw lg:w-55vw xl:w-50vw xxl:w-45vw"
        >
          Legend Has It...a new hi-fi bar is coming soon to Sacramento
        </h1>
      </div>
      <div>
        <h2 className="font-hypatia text-2xl text-white text-center w-85vw lg:w-50vw xl:w-45vw xxl:w-40vw">
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
            className="bg-transparent font-ubuntuRegular py-2 px-4 border border-white border-opacity-50 rounded-lg w-85vw lg:w-50vw xl:w-45vw xxl:w-40vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
          />
          <button className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 mt-7 tracking-wider">
            <span className="text-white leading-none text-sm">SUBMIT</span>
          </button>
        </form>
      </div>
      <div className="flex justify-between items-center space-x-4 text-white">
        <a
          href="https://www.instagram.com/legendhasithifi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon className="w-7 h-7 text-white" />
        </a>
        <a
          href="https://www.youtube.com/@legendhasithifi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <YouTubeIcon className="w-7 h-7 text-white" />
        </a>
        <a
          href="https://www.facebook.com/legendhasithifi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon className="w-7 h-7 text-white" />
        </a>
      </div>
    </main>
  );
}
