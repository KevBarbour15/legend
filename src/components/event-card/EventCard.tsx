import { useState, useRef, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

import { X } from "@phosphor-icons/react";
import { IconButton } from "@mui/material";

import { EventCardProps } from "@/data/events";
import { createPortal } from "react-dom";
import { formatTime } from "@/utils/time";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Image from "next/image";

const EventCard: React.FC<EventCardProps> = ({ event, preloadedMedia }) => {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formattedTime = formatTime(event.time);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    timeZone: "UTC",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.body.style.overflow = "auto";
        setIsActive(false);
      }
    };

    if (isActive) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);

  useOutsideClick(containerRef, () => setIsActive(false));

  const handleCardClick = () => {
    document.body.style.overflow = "hidden";
    setIsActive(true);
  };

  const handleCloseCard = () => {
    document.body.style.overflow = "auto";
    setIsActive(false);
  };

  const renderPortal = () => {
    return createPortal(
      <AnimatePresence>
        {isActive && (
          <div className="fixed inset-0 z-[200] grid place-items-center bg-black/5 px-6 drop-shadow-card backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="fixed inset-0"
              onClick={() => setIsActive(false)}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full md:right-6 md:top-6"
            >
              <IconButton aria-label="Close Modal" onClick={handleCloseCard}>
                <X
                  size={30}
                  weight="regular"
                  className="rounded-full text-customNavy drop-shadow-text transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                />
              </IconButton>
            </motion.div>

            <motion.div
              ref={containerRef}
              layoutId={`card-${event._id}`}
              className={`relative flex h-fit max-h-[85dvh] w-full flex-col overflow-y-auto rounded-lg border-2 px-3 pt-3 text-customNavy shadow-2xl ${isActive ? "border-customNavy" : "border-transparent"} bg-[#f5f5f5] backdrop-blur-sm transition-all duration-300 sm:max-h-[90vh] sm:max-w-[475px]`}
            >
              {event.is_photo ? (
                <motion.div
                  layoutId={`image-${event._id}`}
                  className="flex-shrink-0 overflow-hidden rounded-lg border-2 border-customNavy"
                >
                  <Image
                    src={preloadedMedia.src}
                    alt={event.title}
                    width={475}
                    height={475}
                    unoptimized
                    priority
                    className="aspect-square h-auto w-full object-cover object-center md:aspect-auto md:max-h-[475px]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  layoutId={`video-${event._id}`}
                  className="flex-shrink-0 overflow-hidden border border-customNavy"
                >
                  <video
                    src={preloadedMedia.src}
                    className="aspect-square h-auto w-full object-cover object-center md:aspect-auto md:max-h-[475px]"
                    loop
                    autoPlay
                    muted
                    playsInline
                  />
                </motion.div>
              )}

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                  <AccordionTrigger className="w-full cursor-pointer pt-3">
                    <motion.h1
                      layoutId={`title-${event._id}`}
                      className="text-balance pr-6 text-left font-bigola text-2xl capitalize"
                    >
                      {event.title}
                    </motion.h1>
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-customGold/50">
                    <motion.div className="flex w-full flex-row justify-between py-3 font-bigola text-lg md:leading-[1.15]">
                      <motion.p layoutId={`date-${event._id}`}>
                        {formattedDate}
                      </motion.p>
                      <motion.p layoutId={`time-${event._id}`}>
                        {formattedTime}
                      </motion.p>
                    </motion.div>
                    <motion.p
                      layoutId={`description-${event._id}`}
                      className="whitespace-pre-wrap pb-6 font-hypatia text-base leading-none md:text-lg md:leading-[1.15]"
                    >
                      {event.description}
                    </motion.p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body,
    );
  };

  return (
    <>
      {renderPortal()}

      <motion.div
        layoutId={`card-${event._id}`}
        onClick={handleCardClick}
        className="flex h-full cursor-pointer justify-between rounded-lg border border-customNavy p-3 drop-shadow-card backdrop-blur-[2px]"
      >
        <div className="flex h-auto w-full min-w-0 flex-col justify-between pr-3 text-customNavy lg:pr-6">
          <motion.h2
            className="font-bigola text-lg leading-none md:text-2xl"
            layoutId={`date-${event._id}`}
          >
            {formattedDate}
          </motion.h2>

          <div className="relative">
            <motion.h1
              layoutId={`title-${event._id}`}
              className="font-bigola text-2xl capitalize leading-none md:text-4xl lg:text-6xl"
            >
              {event.title}
            </motion.h1>
          </div>
        </div>
        {event.is_photo ? (
          <motion.div
            layoutId={`image-${event._id}`}
            className="flex-shrink-0 overflow-hidden rounded-none border border-customNavy"
          >
            <Image
              src={preloadedMedia.src}
              alt={event.title}
              width={275}
              height={275}
              unoptimized
              priority
              className="aspect-square h-[125px] w-[125px] object-cover object-center md:h-[225px] md:w-[225px] lg:h-[275px] lg:w-[275px]"
            />
          </motion.div>
        ) : (
          <motion.div
            layoutId={`video-${event._id}`}
            className="flex-shrink-0 overflow-hidden rounded-none border border-customNavy"
          >
            <video
              src={preloadedMedia.src}
              className="aspect-square h-[125px] w-[125px] object-cover object-center md:h-[225px] md:w-[225px] lg:h-[275px] lg:w-[275px]"
              loop
              autoPlay
              muted
              playsInline
            />
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default EventCard;
