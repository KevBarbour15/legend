import { useRef } from "react";
import { LoadingProps } from "@/types/loading.ts";

import { Progress } from "@/components/ui/progress";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

const Loading: React.FC<LoadingProps> = ({ progress, message, loading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current || !loading) return;

    const p = new SplitText("#loading-text", {
      type: "chars",
    });

    tl.current = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });
    tl.current.to(p.chars, {
      duration: 0.25,
      opacity: 0.15,
      ease: "power1.inOut",
      stagger: {
        each: 0.1,
        repeat: 1,
        yoyo: true,
      },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      id="event-subheading"
      className="flex h-[50vh] w-full flex-col items-center justify-center opacity-0"
    >
      <h2
        id="loading-text"
        className="mb-6 mt-3 font-bigola text-3xl text-customGold md:text-4xl"
      >
        {message}
      </h2>
      <Progress
        value={progress}
        className="w-[75vw] max-w-[350px] text-customCream"
      />
    </div>
  );
};

export default Loading;
