import { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

import { X } from "@phosphor-icons/react";
import { IconButton } from "@mui/material";

import { EventCardProps } from "@/data/events";
import { createPortal } from "react-dom";
import Divider from "@/components/divider/Divider";
import { formatTime } from "@/utils/time";

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
          <div className="fixed inset-0 z-[200] grid place-items-center bg-black bg-opacity-65 px-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0"
              onClick={() => setIsActive(false)}
            />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full md:right-6 md:top-6"
              onClick={() => setIsActive(false)}
            >
              <IconButton aria-label="Close Modal" className="p-0">
                <X size={32} className="text-customCream" />
              </IconButton>
            </motion.button>

            <motion.div
              layoutId={`card-${event._id}`}
              className="relative flex h-fit max-h-[85svh] w-full flex-col overflow-hidden rounded-sm border border-customGold bg-customNavy px-3 pt-3 shadow-md sm:max-h-[95vh] sm:max-w-[425px] md:px-6 md:pt-6"
            >
              {event.is_photo ? (
                <motion.div
                  layoutId={`image-${event._id}`}
                  className="flex-shrink-0"
                >
                  <Image
                    width={300}
                    height={300}
                    src={preloadedMedia.src}
                    alt={event.title}
                    className="aspect-square w-full rounded-sm object-cover object-center"
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

              <motion.h2
                layoutId={`title-${event._id}`}
                className="text-balance py-3 text-left font-bigola text-xl text-customGold"
              >
                <h2 className="leading-none sm:text-2xl md:text-3xl">
                  {event.title}
                </h2>
              </motion.h2>

              <div className="flex items-center justify-between text-nowrap border-b border-customGold pb-3 font-hypatia text-base text-customWhite">
                <motion.p layoutId={`date-${event._id}`}>
                  <p className="leading-none">{formattedDate}</p>
                </motion.p>

                <Divider borderColor={"border-customWhite"} />

                <motion.p
                  layoutId={`time-${event._id}`}
                  className="leading-none"
                >
                  <p className="leading-none">{formattedTime}</p>
                </motion.p>
              </div>
              <div className="flex-grow overflow-y-auto [mask-image:linear-gradient(180deg,transparent,black_0.75rem,black_calc(100%-1.5rem),transparent)]">
                <motion.p
                  layoutId={`description-${event._id}`}
                  className="whitespace-pre-wrap py-3 font-hypatia text-lg leading-tight text-customWhite md:pb-6"
                >
                  {event.description}
                </motion.p>
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

      <motion.div
        layoutId={`card-${event._id}`}
        onClick={handleCardClick}
        className="cursor-pointer rounded-sm bg-transparent transition-all duration-300 md:hover:bg-black md:hover:bg-opacity-15 md:hover:shadow-lg"
      >
        <div className="flex h-full space-x-3 md:space-x-6">
          {event.is_photo ? (
            <motion.div
              layoutId={`image-${event._id}`}
              className="flex-shrink-0"
            >
              <Image
                width={225}
                height={225}
                src={preloadedMedia.src}
                alt={event.title}
                className="aspect-square h-[115px] w-[115px] rounded-sm object-cover object-center md:h-[225px] md:w-[225px]"
              />
            </motion.div>
          ) : (
            <motion.div
              layoutId={`video-${event._id}`}
              className="flex-shrink-0"
            >
              <video
                src={preloadedMedia.src}
                className="aspect-square h-[115px] w-[115px] rounded-sm object-cover object-center md:h-[225px] md:w-[225px]"
                loop
                autoPlay
                muted
                playsInline
              />
            </motion.div>
          )}

          <div className="flex w-full flex-col justify-end border-b border-customGold pb-2 md:pb-3">
            <motion.p
              layoutId={`date-${event._id}`}
              className="text-left font-bigola text-sm text-customGold md:text-2xl"
            >
              {formattedDate}
            </motion.p>
            <motion.h3
              layoutId={`title-${event._id}`}
              className="text-balance font-bigola text-2xl leading-none text-customCream sm:text-4xl md:text-5xl lg:w-3/4"
            >
              {event.title}
            </motion.h3>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default EventCard;
