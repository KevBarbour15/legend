"use client";
import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { LogIn } from "lucide-react";

import Link from "next/link";

import "./menu.css";

import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import {
  Instagram,
  Facebook,
  YouTube,
  CloseRounded,
} from "@mui/icons-material";

import { IconButton } from "@mui/material";

const links = [
  { path: "/", label: "About" },
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
  const router = useRouter();

  useGSAP(() => {
    if (!container.current) return;

    gsap.set(".menu-link-item-holder", { y: 75, scale: 1, opacity: 0 });
    gsap.set(".menu-logo-icon", { opacity: 0 });
    gsap.set(".menu-overlay", { opacity: 0 });
    gsap.set(".menu-info-row", { opacity: 0 });
    gsap.set(".menu-close-icon", { opacity: 0 });
    gsap.set(".menu-login-link", { opacity: 0 });

    tl.current = gsap
      .timeline()
      .to(".menu-overlay", {
        duration: 0.35,
        delay: -0.15,
        ease: "power4.inOut",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        opacity: 1,
      })
      .to(".menu-link-item-holder", {
        y: 0,
        duration: 0.25,
        stagger: 0.075,
        delay: -0.15,
        ease: "linear",
        opacity: 1,
      })
      .to(".menu-logo-icon", {
        opacity: 1,
        duration: 0.2,
        delay: -0.15,
      })
      .to(".menu-close-icon", {
        opacity: 1,
        duration: 0.2,
        delay: -0.15,
      })
      .to(".menu-login-link", {
        opacity: 1,
        duration: 0.2,
        delay: -0.15,
      })
      .to(".menu-info-row", {
        opacity: 1,
        delay: -0.15,
        duration: 0.2,
      });
  }, []);

  useEffect(() => {
    if (menuStatus) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [menuStatus]);

  /*
  const handleAboutScroll = async (e: React.MouseEvent) => {
    e.preventDefault();

    await router.push("/");
    setTimeout(() => {
      const aboutSection = document.getElementById("about-content");

      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };
  */
  return (
    <div className="menu-container" ref={container}>
      <div className="menu-overlay">
        <CloseRounded className="menu-close-icon" onClick={toggleMenu} />
        <div className="menu-logo-container">
          <Image
            className="menu-logo-icon"
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
          <div className="menu-info-row opacity-0">
            <IconButton
              className="text-5xl text-customNavy transition-colors md:hover:text-customGold"
              href="https://www.instagram.com/legendhasithifi/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram fontSize="inherit" />
            </IconButton>

            <IconButton
              className="text-5xl text-customNavy transition-colors md:hover:text-customGold"
              href="https://www.facebook.com/legendhasithifi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook fontSize="inherit" />
            </IconButton>

            <IconButton
              className="text-5xl text-customNavy transition-colors md:hover:text-customGold"
              href="https://www.youtube.com/@legendhasithifi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTube fontSize="inherit" />
            </IconButton>
          </div>
          <LoginLink postLoginRedirectURL="/dashboard">
            <LogIn className="menu-login-link" />
          </LoginLink>
        </div>
      </div>
    </div>
  );
};

export default Menu;
