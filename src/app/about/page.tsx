"use client";
import { use, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set("#title", {
      opacity: 0,
      scale: 0.75,
    });

    gsap.set("#map", {
      opacity: 0,
      scale: 0,
      y: 200,
    });

    tl.current = gsap
      .timeline({})
      .to(
        "#title",
        {
          duration: 0.35,
          opacity: 1,
          scale: 1,
          ease: "linear",
        },
        0.4,
      )
      .to(
        "#map",
        {
          duration: 0.75,
          opacity: 1,
          scale: 1,
          ease: "back.out(0.75)",
          y: 0,
        },
        0.7,
      );
  }, []);
  return (
    <div
      ref={containerRef}
      className="flex w-screen flex-col items-center justify-center text-center"
    >
      <h1
        id="title"
        className="w-90vw font-bigola text-4xl text-customWhite opacity-0 lg:w-50vw lg:text-5xl xl:w-45vw xxl:w-40vw"
      >
        About coming soon...
      </h1>

      <div
        id="map"
        className="mt-5 border-4 border-solid border-customGold opacity-0"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3118.9963546287295!2d-121.50463458858096!3d38.57993176525615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ad12b9928b091%3A0x8fd24ebe337fbfe7!2sLegend%20Has%20It!5e0!3m2!1sen!2sus!4v1721929967965!5m2!1sen!2sus"
          width="400"
          height="300"
          loading="lazy"
          className="w-75vw lg:w-25vw xl:w-25vw xxl:w-25vw"
        ></iframe>
      </div>
    </div>
  );
}
