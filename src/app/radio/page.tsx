"use client";
import AudioStatic from "@/components/audio-static/AudioStatic";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Footer from "@/components/footer/Footer";
import { FaPatreon } from "react-icons/fa6";

const Radio = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const tl = gsap.timeline({ delay: 0.25 });

    tl.set(cardRef.current, {
      opacity: 0,
      y: 25,
    })
      .to(cardRef.current, {
        y: 0,
        duration: 0.4,
        ease: "back.out(2.7)",
        opacity: 1,
      })
      .to(contentRef.current, {
        opacity: 1,
        duration: 0.25,
      });
  }, []);
  return (
    <>
      <AudioStatic />
      <div className="pt-16 md:pt-0" ref={containerRef}>
        <div className="mx-auto px-3 pt-3 md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div
            ref={cardRef}
            className="rounded-sm border border-neutral-400/20 bg-customWhite/25 p-4 text-customNavy opacity-0 backdrop-blur-[2px] box-shadow-card"
          >
            <div className="mb-3 flex flex-col space-y-3 text-pretty font-hypatia drop-shadow-text">
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
          <div
            ref={contentRef}
            className="my-12 flex flex-col text-pretty font-hypatia text-lg leading-[1.5] text-customNavy opacity-0 drop-shadow-text"
          >
            <p className="mb-3 flex gap-1">
              Consider becoming a paid subscriber to our
              <a
                className="ml-1 flex items-center gap-1 font-bigola duration-300 ease-in-out md:hover:text-customGold"
                href="https://www.patreon.com/legendhasit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Support Legend Has It on Patreon"
                title="Support us on Patreon"
              >
                Patreon <FaPatreon size={16} />
              </a>
              .
            </p>

            <p className="mb-8">
              Our city's music scene is more than just entertainment; it's
              culture, connection, and community. By subscribing to one of our
              Patreon paid tiers, you're directly supporting local DJs, artists,
              and creatives who keep Sacramento's soul alive through music and
              art.
            </p>
            <p className="mb-3">Your contribution helps fund:</p>
            <ul className="list-disc text-balance pl-4">
              <li>Fair pay for DJs and performers</li>
              <li>Equipment upkeep and live recordings</li>
              <li>Content creation that showcases our scene to the world</li>
              <li>
                A safe, inclusive space for people to gather, vibe, and grow
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Radio;
