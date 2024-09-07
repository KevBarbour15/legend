"use client";
import Link from "next/link";

import MusicPlayer from "../music-player/MusicPlayer";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

const links = [
  { path: "/", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/events", label: "Events" },
];

const SideMenu: React.FC = ({}) => {
  useGSAP(() => {
    const menuLinks = document.querySelectorAll(".menu-link");

    menuLinks.forEach((menuLink) => {
      menuLink.addEventListener("mouseenter", () => {
        gsap.to(menuLink, {
          duration: 0.3,
          ease: "bounce",
          x: 10,
        });
      });

      menuLink.addEventListener("mouseleave", () => {
        gsap.to(menuLink, {
          duration: 0.3,
          ease: "bounce",
          x: 0,
        });
      });

      menuLink.addEventListener("onclick", () => {
        gsap.to(menuLink, {
          duration: 0.3,
          ease: "bounce",
          x: 0,
        });
      });
    });

    return () => {
      menuLinks.forEach((menuLink) => {
        menuLink.removeEventListener("mouseenter", () => {});
        menuLink.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);
  return (
    <>
      <div className="side-menu flex h-screen flex-col justify-between text-customCream md:fixed md:w-fit md:p-6">
        <div className="flex h-full flex-col justify-between pl-6 pt-6 md:justify-start md:p-0">
          <ul
            className="font-bigola text-3xl uppercase drop-shadow-text"
            id="menu-text"
          >
            {links.map((link, idx) => (
              <li key={idx} className="menu-link m-0 p-0">
                <Link href={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <div className="menu-link mt-12 w-fit font-bigola drop-shadow-text">
            <img
              className="mb-3 w-[150px] drop-shadow-text md:hidden"
              src="./images/alt-logo.png"
            ></img>
            <a
              className="cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.google.com/maps/dir//410+L+St,+Sacramento,+CA+95814/@38.5798987,-121.5844553,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x809ad12b9928b091:0x8fd24ebe337fbfe7!2m2!1d-121.5020543!2d38.5799276?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D"
            >
              <div id="menu-text" className="flex justify-between text-3xl">
                <p>410</p>
                <p>L</p>
                <p>St</p>
              </div>
              <p id="menu-text" className="flex justify-between text-2xl">
                <span>S</span>
                <span>a</span>
                <span>c</span>
                <span>r</span>
                <span>a</span>
                <span>m</span>
                <span>e</span>
                <span>n</span>
                <span>t</span>
                <span>o</span>
              </p>
              <div id="menu-text" className="flex justify-between text-3xl">
                <p>CA</p>
                <p>95814</p>
              </div>
            </a>
          </div>
        </div>

        <MusicPlayer tracks={tracks} />
      </div>
    </>
  );
};

export default SideMenu;
