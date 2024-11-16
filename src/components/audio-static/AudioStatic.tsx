import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const AudioStatic = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const staticRef = useRef<HTMLDivElement>(null);

  const staticAnimation = (staticBg: HTMLDivElement) => {
    gsap.to(staticBg, {
      backgroundPosition:
        Math.floor(Math.random() * 100) +
        1 +
        "% " +
        Math.floor(Math.random() * 10) +
        1 +
        "%",
      onComplete: () => {
        staticAnimation(staticBg);
      },
      onCompleteParams: [staticBg],
      ease: "bounce.inOut",
      duration: 0.01,
    });
  };

  useGSAP(() => {
    if (!containerRef.current || !staticRef.current) return;

    staticAnimation(staticRef.current);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" ref={containerRef}>
      <div
        ref={staticRef}
        className="absolute left-1/2 top-1/2 z-[2] h-[100%] w-[100%] -translate-x-1/2 -translate-y-1/2 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: `url(https://static.tumblr.com/rxfwyqf/20Zlzzth8/noise.png)`,
        }}
      />
    </div>
  );
};

export default AudioStatic;
