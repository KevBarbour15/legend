import { useState, useRef, useEffect, useCallback } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createPortal } from "react-dom";

import { useOutsideClick } from "@/hooks/use-outside-click";

import { X } from "@phosphor-icons/react";
import { IconButton } from "@mui/material";

import { EventCardProps } from "@/data/events";
import { formatTime } from "@/utils/time";
import { parseEventDate } from "@/utils/date";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Image from "next/image";

const EventCard: React.FC<EventCardProps> = ({ event, preloadedMedia }) => {
  const [isActive, setIsActive] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const formattedTime = formatTime(event.time);
  const formattedDate = parseEventDate(event.date).toLocaleDateString("en-US");

  const handleCloseCard = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isRendered ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isRendered]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseCard();
      }
    };

    if (isRendered && typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isRendered, handleCloseCard]);

  useOutsideClick(containerRef, handleCloseCard);

  const handleCardClick = () => {
    setIsRendered(true);
    setIsActive(true);
  };

  // Modal open/close animations
  useGSAP(
    () => {
      if (!isRendered) return;

      const backdropEl = backdropRef.current;
      const modalEl = containerRef.current;
      const closeEl = closeButtonRef.current;
      const mediaEl = mediaRef.current;

      if (!backdropEl || !modalEl || !closeEl) return;

      gsap.killTweensOf(
        [backdropEl, modalEl, closeEl, mediaEl].filter(Boolean),
      );

      if (isActive) {
        gsap.set(backdropEl, { opacity: 0 });
        gsap.set(closeEl, { opacity: 0 });
        gsap.set(modalEl, { opacity: 0, scale: 1, y: 25 });
        if (mediaEl) gsap.set(mediaEl, { opacity: 0 });

        const tl = gsap.timeline();
        tl.to(backdropEl, {
          opacity: 1,
          duration: 0.3,
          ease: "power1.inOut",
        });
        tl.to(closeEl, { opacity: 1, duration: 0.25, ease: "power1.inOut" }, 0);
        tl.to(
          modalEl,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.inOut",
          },
          0,
        );
        if (mediaEl) {
          tl.to(
            mediaEl,
            { opacity: 1, duration: 0.2, ease: "power1.out" },
            0.05,
          );
        }
      } else {
        gsap
          .timeline({
            onComplete: () => setIsRendered(false),
          })
          .to(
            modalEl,
            {
              opacity: 0,
              scale: 0.98,
              y: 8,
              duration: 0.25,
              ease: "power2.inOut",
            },
            0,
          )
          .to(closeEl, { opacity: 0, duration: 0.25, ease: "power1.out" }, 0)
          .to(
            backdropEl,
            { opacity: 0, duration: 0.25, ease: "power1.out" },
            0,
          );
      }
    },
    { dependencies: [isActive, isRendered] },
  );

  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el) return;

      const onEnter = () =>
        gsap.to(el, { scale: 1.05, duration: 0.2, ease: "power1.inOut" });
      const onLeave = () =>
        gsap.to(el, { scale: 1, duration: 0.2, ease: "power1.inOut" });
      const onDown = () =>
        gsap.to(el, { scale: 0.985, duration: 0.1, ease: "power1.inOut" });
      const onUp = () =>
        gsap.to(el, { scale: 1.02, duration: 0.15, ease: "power1.inOut" });

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("mousedown", onDown);
      el.addEventListener("mouseup", onUp);

      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("mousedown", onDown);
        el.removeEventListener("mouseup", onUp);
      };
    },
    { dependencies: [] },
  );

  const renderPortal = () => {
    if (!isMounted || typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <>
        {isRendered && (
          <div
            className="fixed inset-0 z-[200] grid place-items-center px-6 drop-shadow-card backdrop-blur-[2px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={backdropRef}
              className="fixed inset-0 bg-black/25 opacity-0"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseCard();
              }}
            />

            <div
              ref={closeButtonRef}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full opacity-0 md:right-6 md:top-6"
            >
              <IconButton
                aria-label="Close Modal"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseCard();
                }}
                className="cursor-pointer"
              >
                <X
                  size={30}
                  weight="regular"
                  className="rounded-full text-customWhite transition-all duration-300 text-shadow-custom md:hover:text-customGold"
                />
              </IconButton>
            </div>

            <div
              ref={containerRef}
              onClick={(e) => e.stopPropagation()}
              className={`relative flex h-fit max-h-[90dvh] w-full flex-col overflow-y-auto rounded-sm border border-customNavy/20 text-customNavy opacity-0 shadow-2xl ${isActive ? "border-customNavy" : "border-transparent"} bg-customWhite transition-all duration-300 sm:max-h-[95vh] sm:max-w-[450px]`}
            >
              {event.is_photo ? (
                <div
                  ref={mediaRef}
                  className="flex-shrink-0 overflow-hidden border-b border-customNavy/20 opacity-0"
                >
                  <Image
                    src={preloadedMedia?.src || event.image_url}
                    alt={event.title}
                    height={700}
                    width={700}
                    sizes="100%"
                    unoptimized
                    priority
                    className="h-auto w-full object-cover object-center"
                  />
                </div>
              ) : (
                <div
                  ref={mediaRef}
                  className="flex-shrink-0 overflow-hidden border-b border-customNavy/20 opacity-0"
                >
                  <video
                    src={preloadedMedia?.src || event.image_url}
                    className="h-auto w-full object-cover object-center"
                    loop
                    autoPlay
                    muted
                    playsInline
                  />
                </div>
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
            </div>
          </div>
        )}
      </>,
      document.body,
    );
  };

  return (
    <>
      {renderPortal()}

      <div
        ref={cardRef}
        onClick={handleCardClick}
        className="h-full w-full transition-all will-change-transform"
      >
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
          <div className="relative h-full w-full overflow-hidden">
            <video
              src={event.image_url}
              className="h-full w-full object-cover object-center"
              loop
              autoPlay
              muted
              playsInline
              width={1000}
              height={1000}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EventCard;
