"use client";

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
const BackgroundOverlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.to("#alt-logo", {
      scale: 1,
      duration: 1,
      ease: "power2.inOut",
      opacity: 1,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      id="background-overlay"
      className="fixed inset-0 z-[-1] h-screen w-screen overflow-hidden bg-cover bg-center"
    >
      <video
        src="/images/Epik.mp4"
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.65] lg:brightness-90"
        autoPlay
        loop
        muted
        playsInline
      />
      <Image
        src="/images/alt-logo.png"
        id="alt-logo"
        className="invisible absolute bottom-6 right-6 scale-50 opacity-0 md:visible"
        alt="Legend Has It logo"
        width={150}
        height={150}
        style={{ height: "auto", width: "auto" }}
        priority={true}
      />
    </div>
  );
};

export default BackgroundOverlay;
