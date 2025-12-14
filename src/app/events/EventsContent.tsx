"use client";
import { useState, useRef, useMemo } from "react";
import { Event, PreloadedMedia } from "@/data/events";

import AudioStatic from "@/components/audio-static/AudioStatic";
import CalendarView from "@/components/calendar-view/CalendarView";

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
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>(
    initialUpcomingEvents,
  );
  const [pastEvents, setPastEvents] = useState<Event[]>(initialPastEvents);
  const [upcomingPreloadedMedia, setUpcomingPreloadedMedia] = useState<
    Map<string, PreloadedMedia>
  >(new Map());
  const [pastPreloadedMedia, setPastPreloadedMedia] = useState<
    Map<string, PreloadedMedia>
  >(new Map());

  const mergedPreloadedMedia = useMemo(() => {
    const merged = new Map<string, PreloadedMedia>();
    upcomingPreloadedMedia.forEach((value, key) => merged.set(key, value));
    pastPreloadedMedia.forEach((value, key) => merged.set(key, value));
    return merged;
  }, [upcomingPreloadedMedia, pastPreloadedMedia]);

  const preloadEventMedia = async () => {
    try {
      await Promise.all(
        upcomingEvents.map((event) =>
          preloadMedia(
            event,
            upcomingPreloadedMedia,
            setUpcomingPreloadedMedia,
          ),
        ),
      );

      await Promise.all(
        pastEvents.map((event) =>
          preloadMedia(event, pastPreloadedMedia, setPastPreloadedMedia),
        ),
      );
    } catch (error) {
      console.error("Error preloading media:", error);
    }
  };

  // Preload media when component mounts
  useGSAP(() => {
    preloadEventMedia();
  }, []);

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-screen pt-16 md:pt-0">
        <div className="mx-auto h-full min-h-[75vh] px-3 pb-12 md:pb-6 md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <CalendarView
            events={[...upcomingEvents, ...pastEvents]}
            preloadedMedia={mergedPreloadedMedia}
          />
        </div>
      </div>
    </>
  );
}
