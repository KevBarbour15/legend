"use client";
import React, { useState, useEffect } from "react";
import NavMenu from "@/components/menu/Menu";
import Image from "next/image";
import { Menu } from "@mui/icons-material";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    
  }, [menuOpen]);

  return (
    <>
      <NavMenu menuStatus={menuOpen} toggleMenu={toggleMenu} />
      <header className="flex flex-row w-screen justify-between items-center fixed top-0 bg-customNavy ">
        <div className="w-10 "></div>

        <div id="logo" className="">
          <Image
            src="/images/logo.png"
            alt="Legend Has It logo"
            width={135}
            height={135}
            priority
          />
        </div>
        <div onClick={toggleMenu} className="w-14">
          <Menu className="cursor-pointer	text-3xl" />
        </div>
      </header>
    </>
  );
};

export default Header;
