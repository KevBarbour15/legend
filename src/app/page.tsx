"use client";
import { useRef } from "react";
import ImageCarousel from "@/components/carousel/Carousel";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileMenu from "@/components/mobile-menu/MobileMenu";
import { Instagram, Facebook, YouTube } from "@mui/icons-material";
import { IconButton } from "@mui/material";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    tl.current = gsap.timeline({
      ease: "sine.inOut",
      scrollTrigger: {
        trigger: "#about-section",
        start: "top 75%",
        end: "top 35%",
        scrub: 1,
      },
    });

    tl.current
      .to(
        ".menu-link",
        {
          color: "#244154",
        },
        0,
      )
      .to(
        "#menu-text",
        {
          color: "#244154",
        },
        0,
      )
      .to(
        "#hidden-bg",
        {
          opacity: 1,
        },
        0,
      );

    const sectionRefs = document.querySelectorAll("#about-section");
    const sectionsTl = gsap.timeline();

    sectionRefs.forEach((section) => {
      if (!section) return;

      sectionsTl.add(
        gsap.fromTo(
          section,
          {
            opacity: 0,
          },
          {
            duration: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: section,
              start: "top bottom-=100",
              end: "top 70%",
              scrub: 1,
            },
          },
        ),
        0,
      );
    });
  }, []);

  return (
    <>
      <SideMenu />
      <MobileMenu />
      <div ref={containerRef} className="block w-screen">
        <div
          id="hidden-bg"
          className="fixed inset-0 z-[-1] h-screen w-screen bg-customCream opacity-0"
        ></div>
        <div className="top-bg hidden h-screen w-full md:block"></div>
        <div
          id="about-section"
          className="relative block h-auto p-3 opacity-0 md:ml-[224px] md:p-6"
        >
          <div
            id="about-section"
            className="opacity-0 md:aspect-video md:overflow-hidden"
          >
            <img src={"/images/about-image.jpg"} className="" />
          </div>

          <div className="font-hypatia text-lg text-customNavy">
            <p id="about-section" className="my-6 opacity-0">
              Welcome to Legend Has It, Sacramento's first hi-fi listening bar,
              where music meets the art of sound. We offer an immersive
              experience for audiophiles and music lovers, celebrating the
              warmth of vinyl records and the richness of high-fidelity sound.
            </p>
            <p id="about-section" className="opacity-0">
              Our carefully curated sound systems and eclectic vinyl collection
              create an intimate atmosphere, perfect for discovering new tunes
              or revisiting classics. Enjoy from our local craft beer menu
              designed to complement your auditory journey. At Legend Has It,
              music legends come to life, and every visit tells a new story
              through sound.
            </p>
          </div>
          <div className="block py-6 font-bigola text-xl text-customNavy md:mb-0 md:text-3xl">
            <h2 id="about-section " className="mb-3 opacity-0 md:mb-6">
              Hours
            </h2>
            <div
              id="about-section"
              className="mb-3 flex flex-row justify-between opacity-0 md:mb-6"
            >
              <p>Sunday - Tuesday:</p>
              <p>Closed</p>
            </div>
            <div
              id="about-section"
              className="mb-3 flex flex-row justify-between opacity-0 md:mb-6"
            >
              <p>Wednesday - Thursday:</p>
              <p>3pm - 11pm</p>
            </div>
            <div
              id="about-section"
              className="flex flex-row justify-between opacity-0"
            >
              <p>Friday - Saturday:</p>
              <p>3pm - 12am</p>
            </div>
          </div>
          <div
            id="about-section"
            className="flex justify-center gap-12 pb-6 font-bigola opacity-0 md:gap-24"
          >
            <IconButton
              className="text-5xl text-customNavy transition-colors md:hover:text-customGold"
              href="https://www.instagram.com/legendhasithifi/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram fontSize="inherit" />
            </IconButton>

            <IconButton
              className="text-5xl text-customNavy transition-colors md:hover:text-customGold"
              href="https://www.facebook.com/legendhasithifi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook fontSize="inherit" />
            </IconButton>

            <IconButton
              className="text-5xl text-customNavy transition-colors md:hover:text-customGold"
              href="https://www.youtube.com/@legendhasithifi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTube fontSize="inherit" />
            </IconButton>
          </div>
          <div id="about-section" className="opacity-0">
            <ImageCarousel />
          </div>
        </div>
      </div>
    </>
  );
}
