import { useState, useRef, useEffect, useCallback } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createPortal } from "react-dom";

import { useOutsideClick } from "@/hooks/use-outside-click";

import { ArrowLeft, X } from "@phosphor-icons/react";
import { IconButton } from "@mui/material";

import { EventCardProps } from "@/data/events";
import { formatTime } from "@/utils/time";
import { parseEventDate } from "@/utils/date";

import Image from "next/image";

const EventCard: React.FC<EventCardProps> = ({ event, preloadedMedia }) => {
  const [isActive, setIsActive] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const formattedTime = formatTime(event.time);
  const formattedDate = parseEventDate(event.date).toLocaleDateString("en-US");

  const handleCloseCard = useCallback(() => {
    setShowDetails(false);
    setIsActive(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isRendered) setShowDetails(false);
  }, [isRendered]);

  useEffect(() => {
    if (showDetails) {
      modalVideoRef.current?.pause();
    } else if (isActive && !event.is_photo) {
      void modalVideoRef.current?.play();
    }
  }, [showDetails, isActive, event.is_photo]);

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

      if (!backdropEl || !modalEl || !closeEl) return;

      gsap.killTweensOf([backdropEl, modalEl, closeEl]);

      if (isActive) {
        gsap.set(backdropEl, { opacity: 0 });
        gsap.set(closeEl, { opacity: 0 });
        gsap.set(modalEl, { opacity: 0, scale: 1, y: 25 });

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
      if (!isRendered || !isActive) return;
      const mediaEl = mediaRef.current;
      if (!mediaEl) return;
      gsap.killTweensOf(mediaEl);
      gsap.to(mediaEl, {
        opacity: showDetails ? 0 : 1,
        duration: 0.4,
        ease: "power2.inOut",
      });
    },
    { dependencies: [isRendered, isActive, showDetails] },
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
              className={`relative w-full max-w-[450px] overflow-hidden rounded-sm border border-customNavy/20 text-customNavy opacity-0 shadow-2xl ${isActive ? "border-customNavy" : "border-transparent"} bg-customWhite transition-all duration-300`}
            >
              <div className="absolute inset-0 z-0 flex flex-col overflow-y-auto px-3 pb-4 pt-3">
                {showDetails && (
                  <div className="flex flex-shrink-0 border-b border-customNavy/20 pb-2">
                    <button
                      type="button"
                      aria-label="Back to event image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDetails(false);
                      }}
                      className="inline-flex cursor-pointer items-center gap-2 py-1 pl-0 pr-3 font-bigola text-sm text-customNavy transition-colors hover:text-customGold md:text-base"
                    >
                      <ArrowLeft size={20} weight="regular" aria-hidden />
                      View image
                    </button>
                  </div>
                )}
                <div className="flex w-full flex-shrink-0 flex-row justify-between py-3 font-bigola text-lg md:leading-[1.25]">
                  <p>{formattedDate}</p>
                  <p>{formattedTime}</p>
                </div>
                <h1 className="text-balance pb-2 font-bigola text-2xl capitalize leading-tight">
                  {event.title}
                </h1>
                <p className="whitespace-pre-wrap font-hypatia text-base leading-snug md:text-lg md:leading-relaxed lg:text-xl">
                  {event.description}
                </p>
              </div>

              <div
                ref={mediaRef}
                className={`relative z-10 flex flex-col bg-customWhite ${showDetails ? "pointer-events-none" : "pointer-events-auto"}`}
              >
                <div className="w-full">
                  {event.is_photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- intrinsic aspect ratio from the asset
                    <img
                      src={
                        preloadedMedia instanceof HTMLImageElement
                          ? preloadedMedia.src
                          : event.image_url
                      }
                      alt={event.title}
                      className="mx-auto block h-auto max-h-[85dvh] w-full object-contain object-center"
                    />
                  ) : (
                    <video
                      ref={modalVideoRef}
                      src={preloadedMedia?.src || event.image_url}
                      className="mx-auto block h-auto max-h-[85dvh] w-full object-contain object-center"
                      loop
                      autoPlay
                      muted
                      playsInline
                    />
                  )}
                </div>
                <div className="flex-shrink-0 border-t border-customNavy/20 bg-customWhite/95 p-3 backdrop-blur-[2px]">
                  <button
                    type="button"
                    aria-label="View event details"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(true);
                    }}
                    className="w-full cursor-pointer rounded-sm border border-customNavy/30 bg-customNavy/5 py-3 font-bigola text-base text-customNavy transition-colors hover:bg-customNavy/10 md:text-lg"
                  >
                    View details
                  </button>
                </div>
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
