"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const links = [
  { path: "/", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/events", label: "Events" },
];

const SideMenu: React.FC = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [scrollToAbout, setScrollToAbout] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (window.location.pathname === "/" && scrollToAbout) {
      setTimeout(() => {
        const aboutSection = document.getElementById("about-section");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      setScrollToAbout(false);
    }
  }, [scrollToAbout]);

  useGSAP(() => {
    const menuLinks = document.querySelectorAll(".menu-link");

    menuLinks.forEach((menuLink) => {
      menuLink.addEventListener("mouseenter", () => {
        gsap.to(menuLink, {
          duration: 0.15,
          ease: "sine.inOut",
          x: 15,
          fontStyle: "italic",
        });
      });

      menuLink.addEventListener("mouseleave", () => {
        gsap.to(menuLink, {
          duration: 0.15,
          ease: "sine.inOut",
          x: 0,
          fontStyle: "normal",
        });
      });
    });

    return () => {
      menuLinks.forEach((menuLink) => {
        menuLink.removeEventListener("mouseenter", () => {});
        menuLink.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  const handleAboutClick = () => {
    if (!isMounted) return;

    if (window.location.pathname === "/") {
      const aboutSection = document.getElementById("about-section");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setScrollToAbout(true);
      router.push("/");
    }
  };

  return (
    <div className="side-menu z-10 hidden h-screen flex-col justify-between text-customCream md:fixed md:flex md:w-fit md:p-6">
      <div className="flex h-full flex-col justify-start pl-6 pt-6 md:p-0">
        <ul className="font-bigola text-3xl" id="menu-text">
          {links.map((link, idx) => (
            <li key={idx} className="menu-link m-0 p-0">
              {link.path === "/" ? (
                <a onClick={handleAboutClick} className="cursor-pointer">
                  {link.label}
                </a>
              ) : (
                <Link href={link.path}>{link.label}</Link>
              )}
            </li>
          ))}
        </ul>
        <div className="menu-link mt-12 w-fit font-bigola">
          <img
            className="mb-6 w-[150px] md:hidden"
            src="./images/alt-logo.png"
            alt="Alternative Logo"
          />
          <a
            className="cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.google.com/maps/dir//410+L+St,+Sacramento,+CA+95814/@38.5798987,-121.5844553,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x809ad12b9928b091:0x8fd24ebe337fbfe7!2m2!1d-121.5020543!2d38.5799276?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D"
          >
            <div id="menu-text" className="flex justify-between text-3xl">
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
            <div id="menu-text" className="flex justify-between text-3xl">
              <p>CA</p>
              <p>95814</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
