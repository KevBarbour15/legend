"use client";
import AudioStatic from "@/components/audio-static/AudioStatic";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoCard from "@/components/video-card/VideoCard";

import { FaPatreon } from "react-icons/fa6";
import { VinylRecord } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const videos = [
  {
    title: "LHI Radio 003: HeyZeusGetLoose",
    heading:
      "We are keeping it in Sacramento and are excited to welcome the amazing DJ/Producer, HeyZeusGetLoose, for our next episode of LHI Radio.",
    description: "Absolutely keeps it fresh and funky!",
    url: "https://player.vimeo.com/video/1133365221?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
  },
  {
    title: "LHI Radio 002: Vinyl Honey",
    heading:
      "We're excited to welcome Vinyl Honey to our second recording of LHI Radio!",
    description:
      "She absolutely takes you on a journey through some Souldies to Funk and R&B, press play and enjoy!",
    url: "https://player.vimeo.com/video/1115726375?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
  },
  {
    title: "LHI Radio 001: DJ Epik",
    heading:
      "Introducing LHI Radio, and there’s no better way to kick things off than with Sacramento’s own DJ Epik behind the decks.",
    description:
      "This isn’t just a set, it’s a full hi-fi experience, captured live at our bar, straight from the crates to your screen: Vinyl-only, analog sound, raw energy.",
    url: "https://player.vimeo.com/video/1100455561?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
  },
];

const Radio = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!containerRef.current) return;
      const cards = gsap.utils.toArray<HTMLElement>(".js-video-card");

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      gsap.fromTo(
        supportRef.current,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          overwrite: "auto",
          scrollTrigger: {
            trigger: supportRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <>
      <AudioStatic />
      <div className="pt-16 md:pt-0" ref={containerRef}>
        <div className="mx-auto px-3 pt-3 md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div
            ref={supportRef}
            className="mb-12 flex flex-col text-pretty font-hypatia text-lg leading-[1.5] text-customNavy opacity-0 drop-shadow-text"
          >
            <h1 className="mb-4 font-bigola text-4xl text-customGold lg:mb-8 lg:text-5xl">
              Join Our Patreon
            </h1>
            <h2 className="mb-4">
              Consider becoming a paid subscriber to our Patreon to support the
              scene.
            </h2>
            <p className="mb-8">
              Our city's music scene is more than just entertainment; it's
              culture, connection, and community. By subscribing to one of our
              Patreon paid tiers, you're directly supporting local DJs, artists,
              and creatives who keep Sacramento's soul alive through music and
              art.
            </p>
            <p className="mb-3 font-bigola text-2xl">
              Your contribution helps fund:
            </p>
            <ul className="mb-10 flex flex-col gap-2 text-balance">
              {[
                "Fair pay for DJs and performers",
                "Equipment upkeep and live recordings",
                "Content creation that showcases our scene to the world",
                "A safe, inclusive space for people to gather, vibe, and grow",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <VinylRecord
                    className="mt-[3px] shrink-0 text-customGold"
                    size={20}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://www.patreon.com/legendhasit"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Support Legend Has It on Patreon"
              title="Support us on Patreon"
            >
              <Button className="flex w-full items-center gap-3 rounded-sm border border-customNavy/20 bg-customNavy font-bigola text-customWhite transition-all duration-300 ease-in-out box-shadow-text sm:w-fit md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold">
                Support the Scene
                <FaPatreon size={16} />
              </Button>
            </a>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
            {videos.map((video) => (
              <div
                key={video.title}
                className="js-video-card h-full w-full opacity-0"
              >
                <VideoCard key={video.title} {...video} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Radio;
