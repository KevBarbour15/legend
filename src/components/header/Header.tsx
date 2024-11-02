"use client";
import React, { useState, useRef } from "react";
import NavMenu from "@/components/dropdown-menu/DropdownMenu";
import Image from "next/image";
import { Menu } from "@mui/icons-material";

// gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set("#logo", { opacity: 0 });
    gsap.set("#menu", { opacity: 0 });

    tl.current = gsap
      .timeline({ ease: "power4.inOut", duration: 0.05 })

      .to(
        "#logo",
        {
          opacity: 1,
        },
        0,
      )
      .to(
        "#menu",
        {
          opacity: 1,
        },
        0,
      );

    let tlScroll = gsap.timeline();

    tlScroll.to("#app-header", {
      scrollTrigger: {
        trigger: "#app-header",
        start: "top+=1 top",
        end: "top top",
        scrub: 1,
      },
      position: "sticky",
      borderBottom: "2px solid #a98541",
      boxShadow: "0 3px 5px rgba(0, 0, 0, 0.35)",
    });
  }, []);

  return (
    <>
      <NavMenu menuStatus={menuOpen} toggleMenu={toggleMenu} />
      <header
        ref={containerRef}
        className="top-0 z-10 flex w-screen flex-row items-center justify-between border-y border-transparent bg-customNavy"
        id="app-header"
      >
        <div className="w-14">&nbsp;</div>

        <div id="logo" className="opacity-0">
          <Image
            src="/images/logo.png"
            alt="Legend Has It logo"
            width={135}
            height={135}
            priority
          />
        </div>
        <div id="menu" onClick={toggleMenu} className="w-14 opacity-0">
          <Menu className="cursor-pointer text-3xl" />
        </div>
      </header>
    </>
  );
};

export default Header;
