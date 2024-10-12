import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { EqualizerProps } from "@/types/equalizer";

const Equalizer: React.FC<EqualizerProps> = ({ playing }) => {
  const bar1Ref = useRef(null);
  const bar2Ref = useRef(null);
  const bar3Ref = useRef(null);
  const bar4Ref = useRef(null);
  const bar5Ref = useRef(null);
  const bar6Ref = useRef(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const bars = [
      bar1Ref.current,
      bar2Ref.current,
      bar3Ref.current,
      bar4Ref.current,
      bar5Ref.current,
      bar6Ref.current,
    ];

    tlRef.current = gsap.timeline({ repeat: -1, yoyo: true, paused: true });

    bars.forEach((bar, index) => {
      tlRef.current!.to(
        bar,
        {
          height: gsap.utils.random(5, 35),
          duration: 0.25,
          ease: "sin.inOut",
        },
        index * 0.1,
      );
    });

    return () => tlRef.current?.kill();
  }, []);

  useEffect(() => {
    if (playing) {
      tlRef.current?.play();
    } else {
      tlRef.current?.pause();
    }
  }, [playing]);

  return (
    <div className="mr-1 flex h-10 items-end justify-center space-x-[1px]">
      <div ref={bar1Ref} className="h-1 w-0.5 bg-customGold" />
      <div ref={bar2Ref} className="h-3 w-0.5 bg-customGold" />
      <div ref={bar3Ref} className="h-2 w-0.5 bg-customGold" />
      <div ref={bar4Ref} className="h-4 w-0.5 bg-customGold" />
      <div ref={bar5Ref} className="h-1 w-0.5 bg-customGold" />
      <div ref={bar6Ref} className="h-3 w-0.5 bg-customGold" />
    </div>
  );
};

export default Equalizer;
