"use client";
import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";

const links = [
  { path: "/", label: "About" },
  { path: "/menu", label: "Menu" },
  { path: "/events", label: "Events" },
  { path: "/contact", label: "Contact" },
];

const MobileMenu: React.FC = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAboutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname !== "/") return;

    const aboutSection = document.getElementById("about-content");
    if (!aboutSection) return;
    aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={menuRef}
      className="flex h-dvh flex-col justify-between text-customCream md:hidden"
    >
      <div className="flex flex-grow flex-col justify-start pl-3 pt-3">
        <Image
          className="w-[115px] md:hidden"
          src="/images/alt-logo.png"
          alt="Logo"
          height={115}
          width={115}
          priority={true}
        />
        <ul className="pt-6 font-bigola text-4xl" id="menu-text">
          {links.map((link, idx) => (
            <li key={idx} className="m-0 p-0 leading-[.85]">
              {link.label === "About" ? (
                <a
                  href="/"
                  onClick={handleAboutClick}
                  aria-label="Navigate to About page"
                  title="About"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.path}
                  aria-label={`Navigate to ${link.label} page`}
                  title={link.label}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-20 ml-3 w-fit font-bigola">
        <a
          className="cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.google.com/maps/dir//410+L+St,+Sacramento,+CA+95814/@38.5798987,-121.5844553,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x809ad12b9928b091:0x8fd24ebe337fbfe7!2m2!1d-121.5020543!2d38.5799276?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D"
          aria-label="Navigate to Google Maps"
          title="Google Maps"
        >
          <div
            id="menu-text"
            className="flex justify-between text-4xl leading-[.85]"
          >
            <p>410</p>
            <p>L</p>
            <p>St</p>
          </div>
          <p
            id="menu-text"
            className="flex justify-between text-2xl leading-none"
          >
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
          <div
            id="menu-text"
            className="flex justify-between text-4xl leading-[.85]"
          >
            <p>CA</p>
            <p>95814</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default MobileMenu;
