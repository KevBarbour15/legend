import { useState, useRef, useEffect } from "react";
import Image from "next/image";

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
  const ref = useRef<HTMLDivElement>(null);
  const formattedTime = formatTime(event.time);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    timeZone: "UTC",
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsActive(false);
    };

    if (isActive) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);

  useOutsideClick(ref, () => setIsActive(false));

  const handleCardClick = () => {
    setIsActive(true);
  };

  const renderPortal = () => {
    return createPortal(
      <AnimatePresence>
        {isActive && (
          <div className="fixed inset-0 z-[200] grid place-items-center bg-black bg-opacity-85 px-6">
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
                onClick={() => setIsActive(false)}
              >
                <X
                  size={24}
                  className="text-customCream transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                />
              </IconButton>
            </motion.div>

            <motion.div
              layoutId={`card-${event._id}`}
              className="relative flex h-fit max-h-[85svh] w-full flex-col overflow-y-auto rounded-sm border border-customGold bg-customNavy bg-opacity-70 px-3 pt-3 shadow-md backdrop-blur-sm transition-all duration-300 sm:max-h-[90vh] sm:max-w-[475px] md:px-6 md:pt-6"
            >
              {event.is_photo ? (
                <motion.div
                  layoutId={`image-${event._id}`}
                  className="flex-shrink-0 rounded-sm shadow-md"
                >
                  <Image
                    width={300}
                    height={300}
                    src={preloadedMedia.src}
                    alt={event.title}
                    className="aspect-square h-auto w-full rounded-sm object-cover object-center md:aspect-auto md:max-h-[475px]"
                    sizes="(max-width: 600px) 350px, (max-width: 1200px) 350px"
                  />
                </motion.div>
              ) : (
                <motion.div
                  layoutId={`video-${event._id}`}
                  className="flex-shrink-0"
                >
                  <video
                    src={preloadedMedia.src}
                    className="aspect-square w-full rounded-sm object-cover object-center"
                    loop
                    autoPlay
                    muted
                    playsInline
                  />
                </motion.div>
              )}

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="border-b-0">
                  <AccordionTrigger className="md:hover: w-full py-3 text-customCream md:hover:scale-105">
                    <motion.p
                      layoutId={`title-${event._id}`}
                      className="text-balance pr-6 text-left font-bigola text-lg capitalize md:text-2xl"
                    >
                      {event.title}
                    </motion.p>
                  </AccordionTrigger>
                  <AccordionContent className="border-customGold">
                    <motion.div className="flex w-full flex-row justify-between pb-3 font-bigola italic text-customGold md:text-lg md:leading-[1.15]">
                      <motion.p layoutId={`date-${event._id}`}>
                        {formattedDate}
                      </motion.p>
                      <motion.p layoutId={`time-${event._id}`}>
                        {formattedTime}
                      </motion.p>
                    </motion.div>
                    <motion.p
                      layoutId={`description-${event._id}`}
                      className="whitespace-pre-wrap pb-3 font-hypatia text-base leading-none text-customCream md:pb-6 md:text-lg md:leading-[1.15]"
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
        className="cursor-pointer py-3"
      >
        <div className="flex h-full">
          <div className="flex w-full flex-col justify-between pr-3">
            <div className="leaeding-none flex flex-row justify-between font-bigola text-lg italic text-customGold md:text-xl">
              <motion.p layoutId={`date-${event._id}`}>
                {formattedDate}
              </motion.p>
              <motion.p
                layoutId={`time-${event._id}`}
                className="hidden md:flex"
              >
                {formattedTime}
              </motion.p>
            </div>

            <motion.h2
              layoutId={`title-${event._id}`}
              className="text-balance font-bigola text-3xl capitalize leading-[0.95] text-customCream md:text-5xl lg:text-6xl"
            >
              <span className="leading-[.85]">{event.title}</span>
            </motion.h2>
          </div>
          {event.is_photo ? (
            <motion.div
              layoutId={`image-${event._id}`}
              className="flex-shrink-0"
            >
              <Image
                width={275}
                height={275}
                src={preloadedMedia.src}
                alt={event.title}
                sizes="(max-width: 600px) 115px, (max-width: 1200px) 275px, 275px"
                className="aspect-square h-[115px] w-[115px] object-cover object-center md:h-[275px] md:w-[275px]"
              />
            </motion.div>
          ) : (
            <motion.div
              layoutId={`video-${event._id}`}
              className="flex-shrink-0"
            >
              <video
                src={preloadedMedia.src}
                className="aspect-square h-[115px] w-[115px] object-cover object-center md:h-[275px] md:w-[275px]"
                loop
                autoPlay
                muted
                playsInline
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default EventCard;
