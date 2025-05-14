"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Menu from "@/components/dropdown-menu/DropdownMenu";

import { List } from "@phosphor-icons/react";
import Image from "next/image";
import { IconButton } from "@mui/material";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const MobileHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageName, setPageName] = useState<string>("/");
  const pathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      "#mobile-heading",
      { opacity: 0, y: -50 },
      { opacity: 1, duration: 0.15, ease: "linear", y: 0, delay: 0.05 },
    );
  }, []);

  useEffect(() => {
    setPageName(pathname.split("/")[1]);
  }, [pathname]);

  return (
    <>
      <Menu menuStatus={menuOpen} toggleMenu={toggleMenu} />
      <div
        ref={containerRef}
        className={`${
          pathname === "/" ? "hidden" : ""
        } drop-shadow-card fixed z-[150] flex h-16 w-full rounded-b-md bg-customNavy px-3 text-customCream md:hidden ${pathname === "/dashboard" ? "hidden" : ""}`}
      >
        <div
          id="mobile-heading"
          className="m-auto flex w-full items-center justify-between opacity-0"
        >
          <div className="h-16 py-3">
            <Link href="/">
              <Image
                src="/images/alt-logo.png"
                alt="Legend Has It"
                className="h-full w-auto"
                width={100}
                height={100}
              />
            </Link>
          </div>
          <IconButton
            onClick={toggleMenu}
            className="bg-transparent p-0 text-customCream"
          >
            <List weight="regular" size={28} />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
