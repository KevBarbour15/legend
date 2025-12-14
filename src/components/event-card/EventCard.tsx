import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";

import { useOutsideClick } from "@/hooks/use-outside-click";

import { X } from "@phosphor-icons/react";
import { IconButton } from "@mui/material";

import { EventCardProps } from "@/data/events";
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
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const formattedTime = formatTime(event.time);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    timeZone: "UTC",
  });

  const handleCloseCard = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keep body scroll lock in sync with modal state
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isActive ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isActive]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseCard();
      }
    };

    if (isActive && typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isActive, handleCloseCard]);

  useOutsideClick(containerRef, handleCloseCard);

  const handleCardClick = () => {
    setIsActive(true);
  };

  const renderPortal = () => {
    if (!isMounted || typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <AnimatePresence mode="wait">
        {isActive && (
          <div
            className="fixed inset-0 z-[200] grid place-items-center bg-black/25 px-6 drop-shadow-card backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="fixed inset-0"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseCard();
              }}
            />

            {/* Close button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full md:right-6 md:top-6"
            >
              <IconButton
                aria-label="Close Modal"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseCard();
                }}
              >
                <X
                  size={30}
                  weight="regular"
                  className="rounded-full text-customWhite transition-all duration-300 text-shadow-custom md:hover:text-customGold"
                />
              </IconButton>
            </motion.div>

            {/* Modal content */}
            <motion.div
              ref={containerRef}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { duration: 0.25, ease: "easeInOut" },
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
                y: 8,
                transition: { duration: 0.25, ease: "easeInOut" },
              }}
              className={`relative flex h-fit max-h-[90dvh] w-full flex-col overflow-y-auto rounded-sm border border-customNavy/20 text-customNavy shadow-2xl ${isActive ? "border-customNavy" : "border-transparent"} bg-customWhite transition-all duration-300 sm:max-h-[95vh] sm:max-w-[450px]`}
            >
              {event.is_photo ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  className="flex-shrink-0 overflow-hidden border-b border-customNavy/20"
                >
                  <Image
                    src={preloadedMedia?.src || event.image_url}
                    alt={event.title}
                    width={475}
                    height={475}
                    unoptimized
                    priority
                    className="h-auto w-full object-cover object-center"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  className="flex-shrink-0 overflow-hidden border-b border-customNavy/20"
                >
                  <video
                    src={preloadedMedia?.src || event.image_url}
                    className="h-auto w-full object-cover object-center"
                    loop
                    autoPlay
                    muted
                    playsInline
                  />
                </motion.div>
              )}

              <div className="flex flex-col">
                <div className="flex w-full flex-row justify-between px-3 py-4 font-bigola text-lg md:leading-[1.15]">
                  <p>{formattedDate}</p>
                  <p>{formattedTime}</p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="description">
                    <AccordionTrigger className="w-full cursor-pointer p-3">
                      <h1 className="text-balance pr-6 text-left font-bigola text-2xl capitalize">
                        {event.title}
                      </h1>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-customGold/50 p-3">
                      <p className="whitespace-pre-wrap pb-3 font-hypatia text-base leading-none md:text-lg md:leading-[1.15] lg:text-xl">
                        {event.description}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
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

      <motion.div onClick={handleCardClick} className="h-full w-full">
        {event.is_photo ? (
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              sizes="100vw"
              unoptimized
              loading="lazy"
              className="object-cover object-center"
            />
          </div>
        ) : (
          <div className="h-full w-full overflow-hidden">
            <video
              src={event.image_url}
              className="h-full w-full object-cover object-center"
              loop
              autoPlay
              muted
              playsInline
            />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default EventCard;
