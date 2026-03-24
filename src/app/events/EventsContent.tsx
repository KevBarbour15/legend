"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Event, PreloadedMedia } from "@/data/events";

import AudioStatic from "@/components/audio-static/AudioStatic";
import CalendarView from "@/components/calendar-view/CalendarView";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { preloadMedia } from "@/utils/preloadMedia";
import { parseEventDate } from "@/utils/date";

interface EventsContentProps {
  initialUpcomingEvents: Event[];
  initialPastEvents: Event[];
}

function eventFallsInMonth(event: Event, month: Date): boolean {
  const d = parseEventDate(event.date);
  return (
    d.getFullYear() === month.getFullYear() &&
    d.getMonth() === month.getMonth()
  );
}

const PRELOAD_CONCURRENCY = 4;

export default function EventsContent({
  initialUpcomingEvents,
  initialPastEvents,
}: EventsContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedIdsRef = useRef<Set<string>>(new Set());
  const upcomingEvents = initialUpcomingEvents;
  const pastEvents = initialPastEvents;
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [preloadedMedia, setPreloadedMedia] = useState<
    Map<string, PreloadedMedia>
  >(() => new Map());

  const allEvents = useMemo(
    () => [...upcomingEvents, ...pastEvents],
    [upcomingEvents, pastEvents],
  );

  const preloadEventsForMonth = useCallback(async (month: Date) => {
    const targets = allEvents.filter((e) => eventFallsInMonth(e, month));
    for (let i = 0; i < targets.length; i += PRELOAD_CONCURRENCY) {
      const batch = targets.slice(i, i + PRELOAD_CONCURRENCY);
      const results = await Promise.all(
        batch.map((event) => preloadMedia(event, loadedIdsRef.current)),
      );
      setPreloadedMedia((prev) => {
        const next = new Map(prev);
        batch.forEach((event, idx) => {
          const el = results[idx];
          if (el) next.set(event._id, el);
        });
        return next;
      });
    }
  }, [allEvents]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void preloadEventsForMonth(calendarMonth);
    }, 120);
    return () => window.clearTimeout(t);
  }, [calendarMonth, preloadEventsForMonth]);

  useGSAP(() => {
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
          <CalendarView
            events={allEvents}
            calendarMonth={calendarMonth}
            onCalendarMonthChange={setCalendarMonth}
            preloadedMedia={preloadedMedia}
          />
        </div>
      </div>
    </>
  );
}
