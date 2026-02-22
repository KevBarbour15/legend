"use client";
import { useRef, useEffect } from "react";

import Image from "next/image";

import ImageCarousel from "@/components/carousel/Carousel";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileMenu from "@/components/mobile-menu/MobileMenu";
import AudioStatic from "@/components/audio-static/AudioStatic";
import Footer from "@/components/footer/Footer";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const updateEventStatus = async () => {
      try {
        const response = await fetch("/api/cron/update-event-status");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    // don't currently need this
    //updateEventStatus();

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";

      window.addEventListener("load", () => {
        window.history.scrollRestoration = "manual";
      });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: "#hidden-bg",
        start: "bottom bottom",
        end: "bottom-=10 40%",
        scrub: true,
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
        ".about-link",
        {
          color: "#bc9952",
        },
        0,
      )
      .to(
        ".player-button",
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
        "#mobile-menu",
        {
          opacity: 0,
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

    const sectionRefs = document.querySelectorAll(".about-section");
    sectionRefs.forEach((section) => {
      if (!section) return;
      gsap.fromTo(
        section,
        {
          opacity: 0,
          x: 25,
        },
        {
          opacity: 1,
          x: 0,
          delay: 0.2,
          duration: 0.65,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            toggleActions: "play none none none",
          },
        },
      );
    });
  }, []);

  return (
    <>
      <SideMenu color="text-customCream" />
      <MobileMenu />
      <div ref={containerRef} className="block w-screen">
        <div
          id="hidden-bg"
          className="fixed inset-0 z-[-1] h-screen w-screen bg-customCream opacity-0"
        >
          <AudioStatic />
        </div>
        <div className="top-bg h-screen w-screen"></div>
        <div
          id="about-content"
          className="relative mx-auto block h-auto md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]"
        >
          <div className="about-section aspect-video w-full px-3 opacity-0 md:px-0">
            <Image
              src="/images/about-image.jpg"
              className="h-full w-full border border-customNavy/20 object-cover object-center drop-shadow-card"
              height={1500}
              width={1500}
              alt="Legend Has It"
              priority={true}
              loading="eager"
            />
          </div>

          <div className="text-pretty px-3 font-hypatia text-lg leading-[1.25] text-customNavy md:px-0 md:text-xl">
            <p className="about-section my-6 opacity-0 text-shadow-custom">
              Welcome to <span className="font-bigola">Legend Has It</span>,
              Sacramento's first hi-fi listening bar, where music meets the art
              of sound. We offer an immersive experience for audiophiles and
              music lovers, celebrating the warmth of vinyl records and the
              richness of high-fidelity sound.
            </p>
            <p className="about-section ] opacity-0 text-shadow-custom">
              We curate a space where the ordinary becomes extraordinary. We
              don't just play sound; we make you feel it. Every beat, every
              conversation, every moment crafted to build something deeper,
              something unforgettable. It's not about passing the time; it's
              about engaging with the energy of the room, the people, and the
              music. We foster transformation in the quiet moments and
              connection in the noise. Here, the world slows down, and every
              interaction lingers, leaving you with something that stays with
              you long after the night ends.
            </p>
          </div>
          <div className="mt-3 block px-3 py-6 font-bigola text-xl text-customNavy text-shadow-custom md:mb-0 md:px-0 md:text-3xl">
            <h2 className="about-section mb-3 opacity-0 md:mb-6">
              Regular Hours
            </h2>
            <div className="about-section mb-3 flex flex-row justify-between opacity-0 md:mb-6">
              <p>Monday - Tuesday:</p>
              <p>Closed</p>
            </div>
            <div className="about-section mb-3 flex flex-row justify-between opacity-0 md:mb-6">
              <p>Wednesday - Thursday:</p>
              <p>3pm - 11pm</p>
            </div>
            <div className="about-section mb-3 flex flex-row justify-between opacity-0 md:mb-6">
              <p>Friday - Saturday:</p>
              <p>3pm - 2am</p>
            </div>
            <div className="about-section mb-3 flex flex-row justify-between opacity-0 md:mb-6">
              <p>Sunday:</p>
              <p>3pm - 8pm</p>
            </div>
            <p className="about-section mb-3 text-pretty font-hypatia text-base italic text-customNavy opacity-0">
              * We occasionally open outside of these hours for game days and
              special events. For the most up-to-date info, please check our
              social media pages.
            </p>
          </div>

          <div className="about-section overflow-hidden opacity-0">
            <ImageCarousel />
          </div>

          <div className="about-section mb-12 mt-3 hidden opacity-0 drop-shadow-card md:block">
            <iframe
              title="Spotify Playlist"
              src="https://open.spotify.com/embed/playlist/4qgu3fFLeZiCIyx3GBRik1?utm_source=generator"
              width="100%"
              height="352"
              allow="encrypted-media"
              loading="lazy"
              className="h-[352px] w-full"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
