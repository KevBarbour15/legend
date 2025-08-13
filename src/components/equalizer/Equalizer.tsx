import React, { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

import { EqualizerProps } from "@/data/equalizer";

const Equalizer: React.FC<EqualizerProps> = ({ playing }) => {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef(null);

  const animateBars = useCallback(() => {
    barRefs.current.forEach((bar) => {
      if (bar) {
        gsap.to(bar, {
          height: `${gsap.utils.random(2, 30)}px`,
          duration: gsap.utils.random(0.2, 0.35),
          ease: "linear",
        });
      }
    });
  }, []);

  useEffect(() => {
    let interval: any;

    if (playing) {
      animateBars();

      interval = setInterval(() => {
        animateBars();
      }, 200);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      barRefs.current.forEach((bar) => {
        if (bar) {
          gsap.to(bar, {
            height: "4px",
            duration: 0.5,
          });
        }
      });
    };
  }, [playing, animateBars]);

  return (
    <div className="flex items-center justify-center space-x-[1px]">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            barRefs.current[index] = el;
          }}
          className="w-[2.25px] bg-customCream text-shadow-custom"
          style={{ minHeight: "2px" }}
        />
      ))}
    </div>
  );
};

export default Equalizer;
