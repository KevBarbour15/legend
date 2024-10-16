import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { X } from "@phosphor-icons/react";
import { EventCardProps } from "@/types/events";
import { createPortal } from "react-dom";
import Divider from "@/components/divider/Divider";
import { formatTime } from "@/utils/time";

const EventCard: React.FC<EventCardProps> = ({ event }) => {
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
          <div className="fixed inset-0 z-[200] grid place-items-center bg-black bg-opacity-50">
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
              <X size={32} />
            </motion.button>
            <motion.div
              layoutId={`card-${event._id}`}
              className="relative flex h-fit max-h-[75vh] w-full max-w-95vw flex-col overflow-hidden rounded-lg border border-customGold bg-customNavy px-3 pt-3 drop-shadow-text sm:max-h-[85vh] sm:max-w-[425px]"
            >
              {event.is_photo && (
                <motion.div
                  layoutId={`image-${event._id}`}
                  className="flex-shrink-0"
                >
                  <Image
                    priority
                    width={300}
                    height={300}
                    src={event.image_url}
                    alt={event.title}
                    className="aspect-square w-full rounded-t-lg object-cover object-top"
                  />
                </motion.div>
              )}

              <div className="mt-3">
                <motion.h3
                  layoutId={`title-${event._id}`}
                  className="font-bigola text-2xl text-customGold"
                >
                  {event.title}
                </motion.h3>
              </div>
              <div className="flex items-center justify-between text-nowrap border-b border-customGold py-3 font-hypatia text-base text-customGold">
                <motion.h3 layoutId={`date-${event._id}`}>
                  {formattedDate}
                </motion.h3>

                <Divider borderColor={"border-customWhite"} />

                <motion.h3 layoutId={`time-${event._id}`}>
                  {formattedTime}
                </motion.h3>
              </div>
              <div className="flex-grow overflow-y-auto [mask:linear-gradient(to_bottom,white,white,transparent)]">
                <motion.p
                  layoutId={`description-${event._id}`}
                  className="py-3 font-hypatia text-lg text-customWhite"
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
        className="cursor-pointer rounded-lg border border-customGold border-transparent p-3 transition-all duration-300 hover:border-customGold hover:bg-customNavy"
      >
        <div className="flex h-full space-x-3">
          {event.is_photo && (
            <motion.div
              layoutId={`image-${event._id}`}
              className="flex-shrink-0"
            >
              <Image
                width={175}
                height={175}
                src={event.image_url}
                alt={event.title}
                className="aspect-square h-[100px] w-[100px] rounded-lg object-cover object-top md:h-[175px] md:w-[175px]"
              />
            </motion.div>
          )}
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col items-center sm:flex-row">
              <motion.h3
                layoutId={`title-${event._id}`}
                className="text-nowrap font-bigola text-xl capitalize text-customGold sm:text-3xl"
              >
                {event.title}
              </motion.h3>
              <div className="hidden sm:flex sm:w-full">
                <Divider borderColor={"border-customWhite"} />
              </div>
              <motion.h3
                layoutId={`date-${event._id}`}
                className="font-bigola text-xl text-customWhite sm:text-3xl sm:text-customGold"
              >
                {formattedDate}
              </motion.h3>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default EventCard;
