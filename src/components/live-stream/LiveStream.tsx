import { useRef } from "react";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const LiveStream: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set(containerRef.current, { opacity: 0 });

    tl.current = gsap.timeline({}).to(containerRef.current, {
      delay: 0.35,
      duration: 0.5,
      opacity: 1,
    });
  }, []);

  return (
    // TODO: create a live stream url to be embedded in main page
    <div
      ref={containerRef}
      className="flex w-screen flex-col items-center justify-center text-center opacity-0"
    >
      <h1 className="my-3.5 font-bigola text-4xl text-customCream lg:text-5xl">
        Live streaming coming soon...
      </h1>
    </div>
  );
};

export default LiveStream;
