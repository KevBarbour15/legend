"use client";
import { useRef, useEffect } from "react";
import SideMenu from "@/components/side-menu/SideMenu";
import ImageCarousel from "@/components/carousel/EmblaCarousel";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

  useGSAP(() => {
    if (!containerRef.current) return;
  }, []);

  return (
    <>
      <div ref={containerRef} className="block w-screen pr-6">
        <div className="hidden h-screen w-full md:block"></div>
        <div className="relative block h-auto w-full bg-red-500">
          <div className="ml-[25vw]">
            <img
              src={"/images/carousel/2.jpg"}
              className="drop-shadow-record"
            />
          </div>
          <div className="ml-[25vw] block py-12 font-bigola text-4xl drop-shadow-text">
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
          <div className="md:ml-[25vw]">
            <ImageCarousel />
          </div>
          <div className="ml-[25vw] flex flex-row gap-6 py-6 font-bigola drop-shadow-text">
            <p className="text-4xl">
              <a>Instagram</a>
            </p>
            <p className="text-4xl">
              <a>Youtube</a>
            </p>
            <p className="text-4xl">
              <a>Facebook</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
