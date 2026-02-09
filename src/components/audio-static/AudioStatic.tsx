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
      ease: "none",
      duration: 0.0075,
    });
  };

  useGSAP(() => {
    if (!containerRef.current || !staticRef.current) return;

    staticAnimation(staticRef.current);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-customCream via-[#e5e5e5] to-customCream"
      ref={containerRef}
    >
      <div
        ref={staticRef}
        className="absolute left-1/2 top-1/2 z-[-1] h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-5 mix-blend-plus-lighter sm:opacity-15"
        style={{
          backgroundImage: `url(https://static.tumblr.com/rxfwyqf/20Zlzzth8/noise.png)`,
        }}
      />
    </div>
  );
};

export default AudioStatic;
