"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const BackgroundOverlay: React.FC = () => {
  const [windowHeight, setWindowHeight] = useState<string>("100vh");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight + "px");

      const updateHeight = () => {
        setWindowHeight(window.innerHeight + "px");
      };

      window.addEventListener("resize", updateHeight);

      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, []);

  return (
    <div
      className="background-overlay fixed inset-0 z-[-1] h-screen bg-cover bg-center transition-all"
      style={{
        backgroundImage: "url(/images/background.jpg)",
        height: isMounted ? windowHeight : "100vh",
      }}
    >
      <Image
        src="/images/alt-logo.png"
        className="invisible absolute bottom-6 right-6 md:visible"
        alt="Legend Has It logo"
        width={150}
        height={150}
        style={{ height: "auto", width: "auto" }}
        priority
      />
    </div>
  );
};

export default BackgroundOverlay;
