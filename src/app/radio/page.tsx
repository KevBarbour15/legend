"use client";
import AudioStatic from "@/components/audio-static/AudioStatic";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Radio = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const tl = gsap.timeline({ delay: 0.25 });

    tl.set(cardRef.current, {
      opacity: 0,
      y: 25,
    }).to(cardRef.current, {
      y: 0,
      duration: 0.4,
      ease: "back.out(2.7)",
      opacity: 1,
    });
  }, []);
  return (
    <>
      <AudioStatic />
      <div className="min-h-screen pt-16 md:pt-0" ref={containerRef}>
        <div className="mx-auto px-3 pt-3 md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div
            ref={cardRef}
            className="rounded-sm border border-neutral-400/20 bg-customWhite/25 p-4 text-customNavy opacity-0 backdrop-blur-[2px] box-shadow-card"
          >
            <div className="mb-3 flex flex-col space-y-3 font-hypatia drop-shadow-text">
              <h2 className="font-bigola text-2xl">LHI Radio 001: DJ Epik</h2>
              <p className="text-lg">
                Introducing LHI Radio, and there’s no better way to kick things
                off than with Sacramento’s own DJ Epik behind the decks.
              </p>
              <p className="text-lg">
                This isn’t just a set, it’s a full hi-fi experience, captured
                live at our bar, straight from the crates to your screen:
                Vinyl-only, analog sound, raw energy.
              </p>
            </div>
            <div
              style={{
                padding: "56.25% 0 0 0",
                position: "relative",
              }}
              className="overflow-hidden rounded-sm"
            >
              <iframe
                src="https://player.vimeo.com/video/1100455561?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                title="LH Radio - 001"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Radio;
