"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Event, PreloadedMedia } from "@/data/events";

import AudioStatic from "@/components/audio-static/AudioStatic";
import Loading from "@/components/loading/Loading";
import EventList from "@/components/event-list/EventList";

import { generateProgress } from "@/utils/progress";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { preloadMedia } from "@/utils/preloadMedia";

export default function Events() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const containerRef = useRef<HTMLDivElement>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const upcomingEventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pastEventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const upcomingEmptyMessageRef = useRef<HTMLDivElement>(null);
  const pastEmptyMessageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [mediaLoaded, setMediaLoaded] = useState<boolean>(false);
  const [upcomingPreloadedMedia, setUpcomingPreloadedMedia] = useState<
    Map<string, PreloadedMedia>
  >(new Map());
  const [pastPreloadedMedia, setPastPreloadedMedia] = useState<
    Map<string, PreloadedMedia>
  >(new Map());

  const animateEvents = useCallback(() => {
    if (loading || !containerRef.current) return;

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
  }, [loading, activeTab, mediaLoaded]);

  useGSAP(() => {
    animateEvents();
  }, [animateEvents, activeTab]);

  const fetchEvents = async () => {
    try {
      setProgress(generateProgress(2, 25));
      await new Promise((resolve) => setTimeout(resolve, 100));

      const updateEventStatus = async () => {
        try {
          const response = await fetch("/api/cron/update-event-status");
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error(error);
        }
      };

      //updateEventStatus();

      const response = await fetch("/api/events", {
        cache: "default",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setProgress(generateProgress(26, 50));
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Events API Error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        setError(`Failed to fetch events: ${response.statusText}`);
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      setProgress(generateProgress(51, 75));
      await new Promise((resolve) => setTimeout(resolve, 100));

      const data: { upcoming: Event[]; past: Event[] } = await response.json();
      setUpcomingEvents(data.upcoming);
      setPastEvents(data.past);

      await Promise.all(
        data.upcoming.map((event) =>
          preloadMedia(
            event,
            upcomingPreloadedMedia,
            setUpcomingPreloadedMedia,
          ),
        ),
      );

      await Promise.all(
        data.past.map((event) =>
          preloadMedia(event, pastPreloadedMedia, setPastPreloadedMedia),
        ),
      );

      await new Promise((resolve) => setTimeout(resolve, 500));
      setMediaLoaded(true);

      setProgress(generateProgress(75, 99));
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Unknown error occurred");
      console.error("Error: ", err);
      setError(err.message);
      setProgress(0);
    } finally {
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="pt-16 md:pt-0">
        <div className="mx-auto flex flex-col items-center justify-center overflow-y-auto px-3 pb-20 md:pb-6 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
          {loading ? (
            <div className="font-bigola">
              <Loading
                progress={progress}
                message={"Loading events..."}
                textColor="text-customNavy"
                borderColor="border-customNavy"
              />
            </div>
          ) : error ? (
            <div className="flex h-[50vh] w-full flex-col items-center justify-center">
              <h2 className="my-3 text-center font-bigola text-3xl text-customNavy md:text-4xl">
                {error}
              </h2>
            </div>
          ) : (
            <div id="event-tabs" className="w-full pt-6 opacity-0 md:pt-0">
              <Tabs
                defaultValue="upcoming"
                className="relative flex w-full flex-col items-center border-0"
                onValueChange={(value) =>
                  setActiveTab(value as "upcoming" | "past")
                }
              >
                <TabsList className="top-0 mb-6 grid w-full grid-cols-2 bg-transparent font-bigola md:mt-0 md:w-[400px]">
                  <TabsTrigger
                    value="upcoming"
                    className="border-customNavy/20"
                  >
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
          )}
        </div>
      </div>
    </>
  );
}
