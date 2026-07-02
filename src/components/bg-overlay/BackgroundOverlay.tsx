"use client";

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const BackgroundOverlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
      className="fixed inset-0 z-[-1] h-screen w-screen overflow-hidden bg-black"
    >
      <Image
        src="/images/new-background.webp"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover object-center brightness-[0.65] lg:brightness-90"
      />
      <Image
        src="/images/alt-logo.png"
        id="alt-logo"
        className={`invisible absolute bottom-6 right-6 scale-50 opacity-0 md:visible ${
          pathname === "/" ? "home-logo-shadow" : ""
        }`}
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
