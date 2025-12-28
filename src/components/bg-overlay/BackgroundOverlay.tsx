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
      //rotateZ: 360,
      opacity: 1,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      id="background-overlay"
      className="fixed inset-0 z-[-1] h-[115svh] w-screen overflow-hidden bg-cover bg-center md:h-screen"
      style={{
        backgroundImage: "url(/images/background.webp)",
      }}
    >
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
