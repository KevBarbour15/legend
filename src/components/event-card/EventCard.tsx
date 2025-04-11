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
          <div className="fixed inset-0 z-[200] grid place-items-center bg-black bg-opacity-65 px-6 backdrop-blur-sm">
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
              <IconButton
                aria-label="Close Modal"
                className="p-0"
                onClick={handleCloseCard}
              >
                <X
                  size={30}
                  weight="bold"
                  className="rounded-full text-customWhite drop-shadow-text transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                />
              </IconButton>
            </motion.div>

            <motion.div
              ref={containerRef}
              layoutId={`card-${event._id}`}
              className={`relative flex h-fit max-h-[85svh] w-full flex-col overflow-y-auto rounded-md border-2 ${isActive ? "border-customGold" : "border-transparent"} bg-customNavy bg-opacity-45 px-3 pt-3 drop-shadow-text backdrop-blur-sm transition-all duration-300 sm:max-h-[90vh] sm:max-w-[475px] md:px-6 md:pt-6`}
            >
              {event.is_photo ? (
                <motion.div
                  layoutId={`image-${event._id}`}
                  className="flex-shrink-0 overflow-hidden rounded-md border-2 border-customGold"
                >
                  <img
                    src={preloadedMedia.src}
                    alt={event.title}
                    className="aspect-square h-auto w-full object-cover object-center md:aspect-auto md:max-h-[475px]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  layoutId={`video-${event._id}`}
                  className="flex-shrink-0"
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
                <AccordionItem value="description" className="border-b-2-0">
                  <AccordionTrigger className="w-full cursor-pointer py-3 text-customWhite">
                    <motion.h2
                      layoutId={`title-${event._id}`}
                      className="text-balance pr-6 text-left font-bigola text-lg capitalize md:text-2xl"
                    >
                      {event.title}
                    </motion.h2>
                  </AccordionTrigger>
                  <AccordionContent className="border-customGold">
                    <motion.div className="flex w-full flex-row justify-between py-3 font-bigola text-customWhite md:text-lg md:leading-[1.15]">
                      <motion.p layoutId={`date-${event._id}`}>
                        {formattedDate}
                      </motion.p>
                      <motion.p layoutId={`time-${event._id}`}>
                        {formattedTime}
                      </motion.p>
                    </motion.div>
                    <motion.p
                      layoutId={`description-${event._id}`}
                      className="whitespace-pre-wrap pb-3 font-hypatia text-base leading-none text-customWhite md:pb-6 md:text-lg md:leading-[1.15]"
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
        className="flex h-full cursor-pointer justify-between overflow-hidden py-3"
      >
        <div className="flex h-auto w-full min-w-0 flex-col justify-between pr-3 md:pr-6">
          <motion.p
            className="font-bigola text-lg leading-none text-customNavy md:text-2xl"
            layoutId={`date-${event._id}`}
          >
            {formattedDate}
          </motion.p>

          <div className="relative">
            <motion.h2
              layoutId={`title-${event._id}`}
              className="line-clamp-2 text-balance font-bigola text-2xl capitalize leading-none text-customNavy md:text-4xl lg:text-6xl"
            >
              {event.title}
            </motion.h2>
          </div>
        </div>
        {event.is_photo ? (
          <motion.div
            layoutId={`image-${event._id}`}
            className="flex-shrink-0 overflow-hidden rounded-md border-2 border-customNavy"
          >
            <img
              src={preloadedMedia.src}
              alt={event.title}
              className="aspect-square h-[125px] w-[125px] object-cover object-center md:h-[225px] md:w-[225px] lg:h-[275px] lg:w-[275px]"
            />
          </motion.div>
        ) : (
          <motion.div
            layoutId={`video-${event._id}`}
            className="flex-shrink-0 border-2 border-customNavy"
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
