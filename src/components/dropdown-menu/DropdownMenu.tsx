"use client";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import "./menu.css";

import { DropdownMenuProps } from "@/data/dropdown-menu";

import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import {
  X,
  InstagramLogo,
  FacebookLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";

import { IconButton } from "@mui/material";

const links = [
  { path: "/", label: "About" },
  { path: "/menu", label: "Menu" },
  { path: "/events", label: "Events" },
  { path: "/contact", label: "Contact" },
];

const Menu: React.FC<DropdownMenuProps> = ({ menuStatus, toggleMenu }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const isAnimating = useRef(false);
  const router = useRouter();

  const staticAnimation = (staticBg: HTMLDivElement) => {
    if (!isAnimating.current) return;

    gsap.to(staticBg, {
      backgroundPosition:
        Math.floor(Math.random() * 100) +
        1 +
        "% " +
        Math.floor(Math.random() * 10) +
        1 +
        "%",
      onComplete: () => {
        staticAnimation(staticBg);
      },
      onCompleteParams: [staticBg],
      ease: "bounce.inOut",
      duration: 0.0075,
    });
  };

  useGSAP(() => {
    if (!containerRef.current || !staticRef.current) return;

    gsap.set(".menu-link-item-holder", { y: 50, opacity: 0 });
    gsap.set(".menu-logo-icon", { opacity: 0 });
    gsap.set(".menu-overlay", { opacity: 0.5 });
    gsap.set(".menu-info-row", { opacity: 0 });
    gsap.set(".menu-close-icon", { opacity: 0 });

    staticAnimation(staticRef.current);

    tl.current = gsap
      .timeline({ paused: true })
      .to(
        ".menu-overlay",
        {
          opacity: 1,
        },
        0,
      )
      .to(".menu-overlay", {
        duration: 0.15,
        delay: -0.15,
        ease: "power4.inOut",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      })
      .to(".menu-link-item-holder", {
        y: 0,
        duration: 0.2,
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
      .to(".menu-info-row", {
        opacity: 1,
        delay: -0.15,
        duration: 0.2,
      });
  }, []);

  useEffect(() => {
    if (menuStatus) {
      isAnimating.current = true;
      if (staticRef.current) {
        staticAnimation(staticRef.current);
      }
      tl.current?.play();
    } else {
      tl.current?.reverse();

      // Wait for the animation to finish before setting isAnimating to false
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        isAnimating.current = false;
      });
    }
  }, [menuStatus]);

  const handleLinkClick = async (path: string, e: React.MouseEvent) => {
    e.preventDefault();

    toggleMenu();
    router.push(path);
  };

  return (
    <div className="menu-container" ref={containerRef}>
      <div className="menu-overlay">
        <div className="menu-static" ref={staticRef}></div>
        <X weight="regular" className="menu-close-icon" onClick={toggleMenu} />
        <div className="menu-logo-container">
          <Image
            className="menu-logo-icon"
            src="/images/alt-logo.png"
            alt="Legend Has It logo"
            width={200}
            height={200}
            priority={true}
            onClick={toggleMenu}
          />
        </div>
        <div className="menu-links-container">
          <div className="menu-links">
            {links.map((link, idx) => (
              <div className="menu-link-item" key={idx}>
                <div className="menu-link-item-holder">
                  <a
                    href={link.path}
                    className="menu-link"
                    onClick={(e) => handleLinkClick(link.path, e)}
                    aria-label={`Navigate to ${link.label} page`}
                    title={link.label}
                  >
                    {link.label}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="menu-info-container">
          <div className="menu-info-row opacity-0">
            <IconButton
              className="text-5xl text-customCream"
              href="https://www.instagram.com/legendhasithifi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Legend Has It on Instagram"
              title="Follow us on Instagram"
            >
              <InstagramLogo size={32} weight="regular" />
            </IconButton>

            <IconButton
              className="text-5xl text-customCream"
              href="https://www.facebook.com/legendhasithifi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Legend Has It on Facebook"
              title="Follow us on Facebook"
            >
              <FacebookLogo size={32} weight="regular" />
            </IconButton>

            <IconButton
              className="text-5xl text-customCream"
              href="https://www.youtube.com/@legendhasithifi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Legend Has It on YouTube"
              title="Follow us on YouTube"
            >
              <YoutubeLogo size={32} weight="regular" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
