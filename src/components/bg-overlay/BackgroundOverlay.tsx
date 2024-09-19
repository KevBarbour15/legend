"use client";
import React, { useEffect, useState } from "react";

const BackgroundOverlay: React.FC = ({}) => {
  const [windowHeight, setWindowHeight] = useState<string>("100vh");

  useEffect(() => {
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
    <>
      <div
        className="background-overlay fixed inset-0 z-[-1] h-screen bg-cover bg-center transition-all"
        style={{
          backgroundImage: "url(/images/background.jpg)",
          height: `${windowHeight}px`,
        }}
      >
        <img
          src="/images/alt-logo.png"
          className="invisible absolute bottom-6 right-6 w-[175px] md:visible"
        />
      </div>
    </>
  );
};

export default BackgroundOverlay;
