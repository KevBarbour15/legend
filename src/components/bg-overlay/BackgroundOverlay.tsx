"use client";
import React, { useEffect, useState } from "react";

const BackgroundOverlay: React.FC = ({}) => {
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      setWindowHeight(window.innerHeight);

      const updateHeight = () => {
        setWindowHeight(window.innerHeight);
      };

      window.addEventListener("resize", updateHeight);

      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, []);

  // Render only when on the client side
  if (!isClient) {
    return null;
  }
  return (
    <>
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center"
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
