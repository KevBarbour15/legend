"use client";
import { useState, useRef, useCallback } from "react";
import { Event, PreloadedMedia } from "@/data/events";

import AudioStatic from "@/components/audio-static/AudioStatic";
import EventList from "@/components/event-list/EventList";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { preloadMedia } from "@/utils/preloadMedia";

interface EventsContentProps {
  initialUpcomingEvents: Event[];
  initialPastEvents: Event[];
}

export default function EventsContent({
  initialUpcomingEvents,
  initialPastEvents,
}: EventsContentProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const containerRef = useRef<HTMLDivElement>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>(
    initialUpcomingEvents,
  );
  const [pastEvents, setPastEvents] = useState<Event[]>(initialPastEvents);
  const upcomingEventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pastEventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const upcomingEmptyMessageRef = useRef<HTMLDivElement>(null);
  const pastEmptyMessageRef = useRef<HTMLDivElement>(null);
  const [mediaLoaded, setMediaLoaded] = useState<boolean>(false);
  const [upcomingPreloadedMedia, setUpcomingPreloadedMedia] = useState<
    Map<string, PreloadedMedia>
  >(new Map());
  const [pastPreloadedMedia, setPastPreloadedMedia] = useState<
    Map<string, PreloadedMedia>
  >(new Map());

  const animateEvents = useCallback(() => {
    if (!containerRef.current) return;

    const currentRefs =
      activeTab === "upcoming" ? upcomingEventRefs : pastEventRefs;
    const currentEmptyRef =
      activeTab === "upcoming" ? upcomingEmptyMessageRef : pastEmptyMessageRef;

    const tl = gsap.timeline({ delay: 0.25 });

    // Initial animation for tabs if not already visible
    const eventTabs = document.querySelector("#event-tabs") as HTMLElement;
    if (eventTabs && !eventTabs.style.opacity) {
      tl.fromTo("#event-tabs", { opacity: 0 }, { opacity: 1, duration: 0.15 });
    }

    if (currentRefs.current.length > 0 && mediaLoaded) {
      tl.set(currentRefs.current, {
        opacity: 0,
        y: 25,
      }).to(currentRefs.current, {
        y: 0,
        duration: 0.4,
        stagger: 0.075,
        ease: "back.out(2.7)",
        opacity: 1,
      });
    }
  }, [activeTab, mediaLoaded]);

  useGSAP(() => {
    animateEvents();
  }, [animateEvents, activeTab]);

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

      await new Promise((resolve) => setTimeout(resolve, 500));
      setMediaLoaded(true);
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
        <div className="mx-auto flex flex-col items-center justify-center overflow-y-auto px-3 pb-12 md:pb-6 md:pl-[240px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          <div id="event-tabs" className="w-full pt-6 opacity-0 md:pt-0">
            <Tabs
              defaultValue="upcoming"
              className="relative flex w-full flex-col items-center border-0"
              onValueChange={(value) =>
                setActiveTab(value as "upcoming" | "past")
              }
            >
              <TabsList className="top-0 mb-6 grid w-full grid-cols-2 bg-transparent font-bigola md:mt-0 md:w-[400px]">
                <TabsTrigger value="upcoming" className="border-customNavy/20">
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="past" className="border-customNavy/20">
                  Past Events
                </TabsTrigger>
              </TabsList>

              <div id="events-container" className="w-full">
                <TabsContent value="upcoming" className="w-full">
                  <EventList
                    events={upcomingEvents}
                    preloadedMedia={upcomingPreloadedMedia}
                    eventRefs={upcomingEventRefs}
                    emptyMessageRef={upcomingEmptyMessageRef}
                    upcoming={true}
                  />
                </TabsContent>
                <TabsContent value="past" className="w-full">
                  <EventList
                    events={pastEvents}
                    preloadedMedia={pastPreloadedMedia}
                    eventRefs={pastEventRefs}
                    emptyMessageRef={pastEmptyMessageRef}
                    upcoming={false}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
