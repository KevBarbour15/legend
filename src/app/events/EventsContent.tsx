"use client";
import { useState, useRef } from "react";
import { Event } from "@/data/events";

import AudioStatic from "@/components/audio-static/AudioStatic";
import CalendarView from "@/components/calendar-view/CalendarView";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { preloadMedia } from "@/utils/preloadMedia";

interface EventsContentProps {
  initialUpcomingEvents: Event[];
  initialPastEvents: Event[];
}

export default function EventsContent({
  initialUpcomingEvents,
  initialPastEvents,
}: EventsContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloadedIdsRef = useRef<Set<string>>(new Set());
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>(
    initialUpcomingEvents,
  );
  const [pastEvents, setPastEvents] = useState<Event[]>(initialPastEvents);

  const preloadEventMedia = async () => {
    try {
      await Promise.all(
        upcomingEvents.map((event) =>
          preloadMedia(event, preloadedIdsRef.current),
        ),
      );

      await Promise.all(
        pastEvents.map((event) => preloadMedia(event, preloadedIdsRef.current)),
      );
    } catch (error) {
      console.error("Error preloading media:", error);
    }
  };

  useGSAP(() => {
    preloadEventMedia();
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: 10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        delay: 0.25,
        ease: "linear",
      },
    );
  }, []);

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-screen pt-16 opacity-0 md:pt-0">
        <div className="mx-auto h-full min-h-[75vh] px-3 pb-12 md:pb-6 md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <CalendarView events={[...upcomingEvents, ...pastEvents]} />
        </div>
      </div>
    </>
  );
}
