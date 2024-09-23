"use client";
import { useRef } from "react";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Menu() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
  });

  return (
    <>
      <div
        ref={containerRef}
        className="flex min-h-screen w-screen flex-row justify-center"
      >


        
      </div>
    </>
  );
}
