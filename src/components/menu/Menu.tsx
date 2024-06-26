"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import "./menu.css";
import { Close } from "@mui/icons-material";

import Image from "next/image";

import { gsap } from "@/lib/gsap/index.ts";
import { useGSAP } from "@gsap/react";

import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";

const links = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/menu", label: "Menu" },
  { path: "/events", label: "Events" },
];

interface MenuProps {
  menuStatus: boolean;
  toggleMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ menuStatus, toggleMenu }) => {
  const container = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap.set(".menu-link-item-holder", { y: 75 });
      gsap.set(".menu-close-icon", { opacity: 0 });
      gsap.set(".menu-info-row svg", { opacity: 0 });

      tl.current = gsap
        .timeline({ paused: true })
        .to(".menu-overlay", {
          duration: 0.5,
          ease: "power4.inOut",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        })
        .to(".menu-link-item-holder", {
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          delay: -0.25,
          ease: "power4.in",
        })
        .to(".menu-close-icon", {
          opacity: 1,
          duration: 0.25,
          delay: -0.25,
        })
        .to(".menu-info-row svg", {
          opacity: 1,
          //x: 0,
          duration: 0.25,
          stagger: -0.15,
          delay: -0.25,
        });
    },
    { scope: container }
  );

  useEffect(() => {
    if (menuStatus) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [menuStatus]);

  return (
    <div className="menu-container" ref={container}>
      {""}
      <div className="menu-overlay">
        <div className="menu-close-container">
          <Image
            className="menu-close-icon"
            src="/images/monogram.png"
            alt="Legend Has It logo"
            width={125}
            height={125}
            priority
            onClick={toggleMenu}
          />
        </div>
        <div className="menu-links-container">
          <div className="menu-links">
            {links.map((link, idx) => (
              <div className="menu-link-item" key={idx}>
                <div className="menu-link-item-holder" onClick={toggleMenu}>
                  <Link href={link.path} className="menu-link">
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="menu-info-container">
          <div className="menu-info-row">
            <a
              href="https://www.instagram.com/legendhasithifi/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.youtube.com/@legendhasithifi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTubeIcon />
            </a>
            <a
              href="https://www.facebook.com/legendhasithifi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
