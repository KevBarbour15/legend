"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
  { path: "/", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/events", label: "Events" },
];

const MobileMenu: React.FC = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState<string>("100vh");
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      setWindowHeight(window.innerHeight + "px");
    }
  }, []);

  const handleAboutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname !== "/" && !isClient) return;

    const aboutSection = document.getElementById("about-section");
    if (!aboutSection) return;
    aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={menuRef}
      className="flex h-screen flex-col justify-between text-customCream md:hidden"
      style={{
        height: `${windowHeight}`,
      }}
    >
      <div className="flex flex-grow flex-col justify-start pl-3 pt-3">
        <img
          className="mb-3 w-[135px] md:hidden"
          src="./images/alt-logo.png"
          alt="Logo"
        />
        <ul className="font-bigola text-4xl" id="menu-text">
          {links.map((link, idx) => (
            <li key={idx} className="m-0 p-0">
              {link.label === "About" ? (
                <a href="/" onClick={handleAboutClick}>
                  {link.label}
                </a>
              ) : (
                <Link href={link.path}>{link.label}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-12 ml-3 w-fit font-bigola">
        <a
          className="cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.google.com/maps/dir//410+L+St,+Sacramento,+CA+95814/@38.5798987,-121.5844553,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x809ad12b9928b091:0x8fd24ebe337fbfe7!2m2!1d-121.5020543!2d38.5799276?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D"
        >
          <div id="menu-text" className="flex justify-between text-4xl">
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
          <div id="menu-text" className="flex justify-between text-4xl">
            <p>CA</p>
            <p>95814</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default MobileMenu;
