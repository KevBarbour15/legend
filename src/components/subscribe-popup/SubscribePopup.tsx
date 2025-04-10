"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { X } from "@phosphor-icons/react";
import { IconButton } from "@mui/material";

import MailchimpForm from "@/components/mailchimp-form/MailchimpForm";

interface PopupConfig {
  showDelay?: number;
  showInterval?: number;
}

const SubscribePopup = ({
  showDelay = 5000,
  showInterval = 7,
}: PopupConfig) => {
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
    console.log("setting up tl");
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
        y: 25,
      })
      .to(containerRef.current, {
        delay: 0.15,
        opacity: 1,
        duration: 0.25,
        y: 0,
      });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShouldShow(false);
    };

    if (shouldShow) {
      document.body.classList.add("overflow-hidden");
      window.addEventListener("keydown", handleKeyDown);
      tl.current?.play();
    } else {
      document.body.classList.remove("overflow-hidden");
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
      className="fixed inset-0 z-[1000] h-full w-full items-center justify-center bg-black bg-opacity-85 p-3 opacity-0"
    >
      <IconButton
        aria-label="Close Modal"
        className="absolute right-3 top-3 md:right-6 md:top-6"
        onClick={() => setShouldShow(false)}
      >
        <X
          size={24}
          className="text-customWhite transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
        />
      </IconButton>
      <div
        style={{ display: "none" }}
        ref={containerRef}
        className="flex h-fit max-h-[85dvh] flex-col gap-3 border-2 border-customGold bg-customWhite p-3 opacity-0 sm:max-h-[90vh] sm:max-w-[425px] sm:p-6"
      >
        <Image
          src="/images/meta-image.jpg"
          alt="Subscribe Image"
          width={500}
          height={500}
          className="h-auto w-full"
        />
        <h2 className="text-balance text-center font-bigola text-2xl font-bold text-customNavy sm:text-3xl">
          Get exclusive updates on new beer/wine & events!
        </h2>
        <MailchimpForm setShouldShow={setShouldShow} />
      </div>
    </div>
  );
};

export default SubscribePopup;
