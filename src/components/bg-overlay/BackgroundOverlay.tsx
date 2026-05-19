"use client";

import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useCallback, useEffect } from "react";

const BackgroundOverlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  const markReady = useCallback(() => {
    setVideoReady(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      markReady();
    }

    void video.play().catch(() => {});
  }, [markReady]);

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
        src="/images/background.webp"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover object-center brightness-[0.65] lg:brightness-90"
      />
      <video
        ref={videoRef}
        src="/images/Epik-2.mp4"
        poster="/images/background.webp"
        className={`absolute inset-0 h-full w-full object-cover object-center brightness-[0.65] transition-opacity duration-700 ease-in-out lg:brightness-90 ${videoReady ? "opacity-100" : "opacity-0"}`}
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={markReady}
        onCanPlay={markReady}
        onPlaying={markReady}
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
