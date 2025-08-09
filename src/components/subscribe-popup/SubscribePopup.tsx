"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { X } from "@phosphor-icons/react";

import { useOutsideClick } from "@/hooks/use-outside-click";
import MailchimpForm from "@/components/mailchimp-form/MailchimpForm";

interface PopupConfig {
  showDelay?: number;
  showInterval?: number;
  buttonStyling?: string;
  inputStyling?: string;
}

const SubscribePopup = ({ showDelay = 0, showInterval = 0 }: PopupConfig) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const getLocalStorage = () => {
    const popupData = localStorage.getItem("subscribe-popup-data");

    if (!popupData) {
      localStorage.setItem(
        "subscribe-popup-data",
        JSON.stringify({
          lastShown: new Date().toISOString(),
          shown: true,
        }),
      );
      return true;
    }

    const { lastShown, shown } = JSON.parse(popupData);
    const lastShownDate = new Date(lastShown);
    const now = new Date();
    const daysSinceLastShown =
      (now.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceLastShown >= showInterval;
  };

  useOutsideClick(containerRef, () => setShouldShow(false));

  useEffect(() => {
    const shouldShowPopup = getLocalStorage();

    if (shouldShowPopup) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, []);

  useGSAP(() => {
    if (!overlayRef.current || !containerRef.current) return;

    tl.current = gsap.timeline({ paused: true });

    tl.current
      .set(overlayRef.current, {
        display: "flex",
      })
      .to(overlayRef.current, {
        opacity: 1,
        duration: 0.25,
      })
      .set(containerRef.current, {
        display: "flex",
        y: 50,
      })
      .to(containerRef.current, {
        delay: 0.15,
        opacity: 1,
        duration: 0.3,
        y: 0,
        ease: "back.out(1.7)",
      });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShouldShow(false);
    };

    if (shouldShow) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      tl.current?.play();
    } else {
      document.body.style.overflow = "auto";
      tl.current?.reverse();

      localStorage.setItem(
        "subscribe-popup-data",
        JSON.stringify({
          lastShown: new Date().toISOString(),
          shown: true,
        }),
      );
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldShow]);

  return (
    <div
      style={{ display: "none" }}
      ref={overlayRef}
      className="fixed inset-0 z-[1000] h-full w-full items-center justify-center p-3 px-6 opacity-0 backdrop-blur-md"
    >
      <button
        type="button"
        aria-label="Close Modal"
        className="fixed right-3 top-3 z-[1001] rounded p-1 md:right-6 md:top-6"
        onClick={() => setShouldShow(false)}
      >
        <X
          size={30}
          weight="bold"
          className="text-customWhite drop-shadow-card transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
        />
      </button>
      <div
        style={{ display: "none" }}
        ref={containerRef}
        className="flex h-fit max-h-[85dvh] flex-col overflow-hidden rounded-sm border border-customNavy/20 bg-customWhite opacity-0 drop-shadow-card sm:max-h-[90vh] sm:max-w-[450px]"
      >
        <Image
          src="/images/meta-image.webp"
          alt="Subscribe Image"
          width={500}
          height={500}
          className="h-auto w-full border-b border-customNavy/20"
        />
        <div className="flex flex-col gap-3 p-3 sm:gap-3 sm:p-4">
          <h2 className="text-pretty font-bigola text-2xl font-bold text-customNavy md:text-4xl">
            Get exclusive updates on new beer/wine & events!
          </h2>
          <MailchimpForm setShouldShow={setShouldShow} />
        </div>
      </div>
    </div>
  );
};

export default SubscribePopup;
