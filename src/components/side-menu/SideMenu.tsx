"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import Image from "next/image";

// animation imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const links = [
  { path: "/", label: "About" },
  { path: "/menu", label: "Menu" },
  { path: "/events", label: "Events" },
  { path: "/contact", label: "Contact" },
];

interface SideMenuProps {
  color?: string;
}

const SideMenu: React.FC<SideMenuProps> = ({ color }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [shouldShowAnimation, setShouldShowAnimation] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    // Check if this is the first visit in session to animate the menu once per "visit"
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      sessionStorage.setItem("hasVisited", "true");
      setShouldShowAnimation(true);
    } else {
      setShouldShowAnimation(false);
    }
  }, []);

  useGSAP(() => {
    const menuLinks = document.querySelectorAll("#hover");
    let tl = gsap.timeline();
    if (shouldShowAnimation) {
      tl.set(menuLinks, { x: "-25%", opacity: 0 });
      tl.to(menuLinks, {
        delay: 0.5,
        duration: 0.65,
        ease: "back.out(2)",
        x: 0,
        opacity: 1,
        stagger: 0.15,
      });
    }

    menuLinks.forEach((menuLink) => {
      menuLink.addEventListener("mouseenter", () => {
        gsap.to(menuLink, {
          duration: 0.2,
          ease: "sine.in",
          x: 20,
          fontStyle: "italic",
        });
      });

      menuLink.addEventListener("mouseleave", () => {
        gsap.to(menuLink, {
          duration: 0.2,
          ease: "sine.out",
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
  }, [shouldShowAnimation]);

  const handleAboutClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isMounted) return;

    if (pathname === "/") {
      const aboutSection = document.getElementById("about-content");
      if (!aboutSection) return;
      aboutSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");

      await new Promise((resolve) => setTimeout(resolve, 500));

      const aboutSection = document.getElementById("about-content");
      if (!aboutSection) return;
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="side-menu z-10 hidden h-screen flex-col justify-between md:fixed md:flex md:py-6 md:pl-6">
      <div className="flex h-full flex-col justify-start pl-6 pt-6 font-bigola text-6xl tracking-tight md:p-0">
        <ul id="menu-text">
          {links.map((link, idx) => (
            <li
              key={idx}
              id="hover"
              className={`${link.path === "/" ? "about-link" : "menu-link"} m-0 p-0 leading-[.75] drop-shadow-text ${
                shouldShowAnimation ? "opacity-0" : "opacity-100"
              } ${
                pathname === link.path && pathname !== "/"
                  ? "text-customGold"
                  : color
              }`}
            >
              {link.path === "/" ? (
                <a
                  onClick={handleAboutClick}
                  className="cursor-pointer"
                  aria-label={`Navigate to About section`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  className="menu-link"
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
        <div
          className={`menu-link mt-12 pr-3 font-bigola ${shouldShowAnimation ? "opacity-0" : "opacity-100"}`}
          id="hover"
        >
          <Image
            className="mb-6 w-[150px] md:hidden"
            src="/images/alt-logo.png"
            alt="Alternative Logo"
            height={150}
            width={150}
            priority={true}
          />
          <a
            className={`cursor-pointer ${color}`}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.google.com/maps/dir//410+L+St,+Sacramento,+CA+95814/@38.5798987,-121.5844553,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x809ad12b9928b091:0x8fd24ebe337fbfe7!2m2!1d-121.5020543!2d38.5799276?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D"
          >
            <div
              id="menu-text"
              className="flex justify-between text-6xl leading-[.65] drop-shadow-text"
            >
              <p>410</p>
              <p>L</p>
              <p>St</p>
            </div>
            <p
              id="menu-text"
              className="flex justify-between text-3xl leading-[.85] drop-shadow-text"
            >
              <span>s</span>
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
              className="flex justify-between text-5xl leading-[.85] drop-shadow-text"
            >
              <p>CA,</p>
              <p>95814</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
