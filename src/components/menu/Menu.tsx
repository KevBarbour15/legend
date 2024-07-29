"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import "./menu.css";
import LoginSharpIcon from "@mui/icons-material/LoginSharp";
import Close from "@mui/icons-material/Close";

import Image from "next/image";

import gsap from "gsap";
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

  useEffect(() => {
     const handleResize = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  },[]);

  useGSAP(() => {
    if (!container.current) return;
    gsap.set(".menu-link-item-holder", { y: 75 });
    gsap.set(".menu-logo-icon", { opacity: 0.5, scale: 0 });
    gsap.set(".menu-overlay", { opacity: 0 });
    gsap.set(".menu-info-row svg", { opacity: 0.5, scale: 0 });
    gsap.set(".menu-close-icon", { opacity: 0.5, rotation: 360, scale: 0 });
    gsap.set(".menu-login-icon", { opacity: 0.5, scale: 0 });

    tl.current = gsap
      .timeline({ paused: true })
      .to(".menu-overlay", {
        duration: 0.35,
        ease: "power4.inOut",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        opacity: 1,
      })
      .to(".menu-link-item-holder", {
        y: 0,
        duration: 0.25,
        stagger: 0.075,
        delay: -0.3,
        ease: "power4.in",
      })
      .to(".menu-logo-icon", {
        opacity: 1,
        duration: 0.2,
        delay: -0.3,
        scale: 1,
      })
      .to(".menu-close-icon", {
        opacity: 1,
        duration: 0.2,
        delay: -0.3,
        rotation: 0,
        scale: 1,
      })
      .to(".menu-login-icon", {
        opacity: 1,
        duration: 0.2,
        delay: -0.3,
        scale: 1,
      })
      .to(".menu-info-row svg", {
        opacity: 1,
        duration: 0.2,
        stagger: -0.1,
        delay: -0.3,
        scale: 1,
      });
  }, []);

  useEffect(() => {
    if (menuStatus) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [menuStatus]);

  return (
    <div className="menu-container" ref={container}>
      <div className="menu-overlay">
        <Close className="menu-close-icon" onClick={toggleMenu} />
        <div className="menu-logo-container">
          <Link href="/">
            <Image
              className="menu-logo-icon"
              src="/images/monogram.png"
              alt="Legend Has It logo"
              width={125}
              height={125}
              priority
              onClick={toggleMenu}
            />
          </Link>
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
        <Link
          className="menu-login-icon"
          href="/dashboard"
          onClick={toggleMenu}
        >
          <LoginSharpIcon />
        </Link>
      </div>
    </div>
  );
};

export default Menu;
