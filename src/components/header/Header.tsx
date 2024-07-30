"use client";
import React, { useState, useRef } from "react";
import NavMenu from "@/components/menu/Menu";
import Image from "next/image";
import { Menu } from "@mui/icons-material";

// gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set("#logo", { opacity: 0, rotation: 90 });
    gsap.set("#menu", { opacity: 0 });

    tl.current = gsap
      .timeline({ ease: "power4.inOut", duration: 0.15 })
      .to("#logo", {
        opacity: 1,
        rotation: 0,
      })
      .to("#menu", {
        opacity: 1,
      });
  }, []);

  return (
    <>
      <NavMenu menuStatus={menuOpen} toggleMenu={toggleMenu} />
      <header
        ref={containerRef}
        className="fixed top-0 z-10 flex w-screen flex-row items-center justify-between bg-customNavy"
      >
        <div className="w-14">&nbsp;</div>

        <div id="logo" className="opacity-0">
          {/* turn to link once full site is live */}
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
