"use client";
import { useRef, useEffect } from "react";
import ImageCarousel from "@/components/carousel/EmblaCarousel";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileMenu from "@/components/mobile-menu/MobileMenu";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const slides = [
  "/images/carousel/1.jpg",
  "/images/carousel/3.jpg",
  "/images/carousel/4.jpg",
  "/images/carousel/5.jpg",
  "/images/carousel/6.jpg",
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    if (!containerRef.current) return;

    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".content-area",
        start: "top 90%",
        end: "top 35%",
        scrub: 1,
      },
    });

    tl.current
      .to(
        ".player-button",
        {
          ease: "none",
          color: "#244154",
        },
        0,
      )
      .to(
        "#menu-text",
        {
          ease: "none",
          color: "#244154",
        },
        0,
      )
      .to(
        "#playlist-item",
        {
          ease: "none",
          color: "#244154",
        },
        0,
      )
      .to(
        "#playlist-border",
        {
          ease: "none",
          borderColor: "#244154",
        },
        0,
      )

      .to(
        ".hidden-bg",
        {
          ease: "none",
          opacity: 1,
        },
        0,
      );
  }, []);

  useEffect(() => {
    const socialLinks = document.querySelectorAll(".social-link");

    socialLinks.forEach((socialLink) => {
      socialLink.addEventListener("mouseenter", () => {
        gsap.to(socialLink, {
          duration: 0.3,
          ease: "bounce",
          x: 10,
          fontStyle: "italic",
        });
      });

      socialLink.addEventListener("mouseleave", () => {
        gsap.to(socialLink, {
          duration: 0.3,
          ease: "bounce",
          fontStyle: "normal",
          x: 0,
        });
      });
    });

    return () => {
      socialLinks.forEach((socialLink) => {
        socialLink.removeEventListener("mouseenter", () => {});
        socialLink.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);
  return (
    <>
      <SideMenu />
      <MobileMenu />
      <div ref={containerRef} className="block w-screen">
        <div className="hidden-bg fixed inset-0 z-[-1] h-screen w-screen bg-customCream opacity-0"></div>
        <div className="top-bg hidden h-screen w-full md:block"></div>
        <div className="content-area relative block h-auto p-6 md:ml-[224px]">
          <div className="md:aspect-video md:overflow-hidden">
            <img
              src={"/images/carousel/2.jpg"}
              className="drop-shadow-record"
            />
          </div>

          <div className="font-hypatia text-lg text-customNavy">
            <p className="my-6">
              Welcome to Legend Has It, Sacramento's first hi-fi listening bar,
              where music meets the art of sound. We offer an immersive
              experience for audiophiles and music lovers, celebrating the
              warmth of vinyl records and the richness of high-fidelity sound.
            </p>
            <p>
              Our carefully curated sound systems and eclectic vinyl collection
              create an intimate atmosphere, perfect for discovering new tunes
              or revisiting classics. Enjoy expertly crafted cocktails and a
              menu designed to complement your auditory journey. At Legend Has
              It, music legends come to life, and every visit tells a new story
              through sound.
            </p>
          </div>
          <div className="mb-6 block py-6 font-bigola text-xl text-customNavy md:mb-0 md:text-3xl">
            <h2 className="mb-6">Hours</h2>
            <div className="mb-6 flex flex-row justify-between">
              <p>Sunday - Tuesday:</p>
              <p>Closed</p>
            </div>
            <div className="flex flex-row justify-between">
              <p>Wednesday - Saturday:</p>
              <p>4pm - 11:30pm</p>
            </div>
          </div>
          <ImageCarousel />
          <h2 className="pt-6 font-bigola text-xl text-customNavy md:text-3xl">
            Socials
          </h2>
          <ul className="mb-12 flex flex-row gap-6 py-6 font-bigola text-xl text-customNavy md:mb-0 md:text-3xl">
            <li className="social-link">
              <a
                className="social-link"
                href="https://www.instagram.com/legendhasithifi/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li className="social-link">
              <a
                href="https://www.facebook.com/legendhasithifi"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>

            <li className="social-link">
              <a
                href="https://www.youtube.com/@legendhasithifi"
                target="_blank"
                rel="noopener noreferrer"
              >
                Youtube
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
