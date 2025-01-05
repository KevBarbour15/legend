"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Event, PreloadedMedia } from "@/data/events";

import AudioStatic from "@/components/audio-static/AudioStatic";
import EventCard from "@/components/event-card/EventCard";
import Loading from "@/components/loading/Loading";

import { generateProgress } from "@/utils/progress";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const containerRef = useRef<HTMLDivElement>(null);
  const upcomingEventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pastEventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const upcomingEmptyMessageRef = useRef<HTMLDivElement>(null);
  const pastEmptyMessageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [preloadedMedia, setPreloadedMedia] = useState<
    Map<string, PreloadedMedia>
  >(new Map());

  const preloadMedia = async (event: Event) => {
    if (preloadedMedia.has(event._id)) {
      return;
    }

    return new Promise((resolve, reject) => {
      if (event.is_photo) {
        const img = new Image();
        img.onerror = reject;
        img.src = event.image_url;
        img.onload = () => {
          setPreloadedMedia((prev) => {
            const newMap = new Map(prev);

            newMap.set(event._id, img);
            return newMap;
          });
          resolve(img);
        };
      } else {
        const video = document.createElement("video");
        video.onerror = reject;
        video.src = event.image_url;
        video.onloadeddata = () => {
          setPreloadedMedia((prev) => {
            const newMap = new Map(prev);
            newMap.set(event._id, video);
            return newMap;
          });
          resolve(video);
        };
        video.load();
      }
    });
  };

  const animateEvents = useCallback(() => {
    if (loading || !containerRef.current) return;

    const currentRefs =
      activeTab === "upcoming" ? upcomingEventRefs : pastEventRefs;
    const currentEmptyRef =
      activeTab === "upcoming" ? upcomingEmptyMessageRef : pastEmptyMessageRef;

    gsap.fromTo("#event-tabs", { opacity: 0 }, { opacity: 1, duration: 0.15 });

    if (currentRefs.current.length > 0) {
      gsap.set("#events-container", { opacity: 0 });
      gsap.set(currentRefs.current, {
        opacity: 0,
        y: 75,
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      });

      gsap.to("#events-container", {
        opacity: 1,
        duration: 0.15,
      });

      gsap.to(currentRefs.current, {
        delay: 0.15,
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        y: 0,
        duration: 0.2,
        stagger: 0.075,
        ease: "linear",
        opacity: 1,
      });
    } else if (currentEmptyRef.current) {
      gsap.set("#events-container", { opacity: 0 });
      gsap.to("#events-container", {
        opacity: 1,
      });
      gsap.fromTo(
        currentEmptyRef.current,
        { opacity: 0 },
        {
          delay: 0.05,
          duration: 0.15,
          opacity: 1,
        },
      );
    }
  }, [loading, activeTab]);

  useGSAP(() => {
    animateEvents();
  }, [animateEvents, activeTab]);

  const fetchEvents = async () => {
    try {
      setProgress(generateProgress(2, 25));
      await new Promise((resolve) => setTimeout(resolve, 125));

      const response = await fetch("/api/events", {
        cache: "default",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setProgress(generateProgress(26, 50));
      await new Promise((resolve) => setTimeout(resolve, 125));

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
      await new Promise((resolve) => setTimeout(resolve, 125));

      const data: Event[] = await response.json();
      setEvents(data);
      await Promise.all(data.map(preloadMedia));

      setProgress(generateProgress(75, 99));
      await new Promise((resolve) => setTimeout(resolve, 125));
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Unknown error occurred");
      console.error("Error: ", err);
      setError(err.message);
      setProgress(0);
    } finally {
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 350));
      setLoading(false);
    }
  };

  const filterEvents = useMemo(() => {
    return (type: "upcoming" | "past") => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      return events.filter((event) => {
        const [year, month, day] = event.date.split("-").map(Number);
        const eventDate = new Date(year, month - 1, day);
        eventDate.setHours(0, 0, 0, 0);

        if (type === "upcoming") {
          return eventDate >= today;
        } else {
          return eventDate < today;
        }
      });
    };
  }, [events]);

  const upcomingEvents = filterEvents("upcoming").sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const pastEvents = filterEvents("past").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  useEffect(() => {
    setProgress(1);
    fetchEvents();
  }, []);

  const EmptyMessage = ({
    message,
    refProp,
  }: {
    message: string;
    refProp: React.RefObject<HTMLDivElement>;
  }) => (
    <div
      ref={refProp}
      className="flex h-[50vh] w-full flex-col items-center justify-center"
    >
      <h2 className="my-3 text-center font-bigola text-3xl text-customNavy md:text-4xl">
        {message}
      </h2>
    </div>
  );

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-dvh w-screen">
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
            <div id="event-tabs" className="w-full pt-3 opacity-0 md:pt-0">
              <Tabs
                defaultValue="upcoming"
                className="relative flex w-full flex-col items-center"
                onValueChange={(value) =>
                  setActiveTab(value as "upcoming" | "past")
                }
              >
                <TabsList className="sticky top-0 mb-3 grid w-full grid-cols-2 bg-transparent font-bigola md:mb-6 md:mt-0 md:w-[400px]">
                  <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                </TabsList>

                <div id="events-container" className="w-full opacity-0">
                  <TabsContent value="upcoming" className="w-full">
                    {upcomingEvents.length > 0 ? (
                      <div className="mb-6">
                        {upcomingEvents.map((event, idx) => (
                          <div className="w-full" key={event._id}>
                            <div
                              ref={(el) => {
                                upcomingEventRefs.current[idx] = el;
                              }}
                              className={`mx-auto w-full border-t border-customGold ${idx === upcomingEvents.length - 1 ? "border-b" : ""}`}
                            >
                              <EventCard
                                key={idx}
                                event={event}
                                preloadedMedia={
                                  preloadedMedia.get(
                                    event._id,
                                  ) as PreloadedMedia
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex w-full flex-col items-center justify-center text-center">
                        <EmptyMessage
                          message="Stay tuned for upcoming events!"
                          refProp={upcomingEmptyMessageRef}
                        />
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="past" className="w-full">
                    {pastEvents.length > 0 ? (
                      <div className="mb-6">
                        {pastEvents.map((event, idx) => (
                          <div key={event._id} className="w-full">
                            <div
                              ref={(el) => {
                                pastEventRefs.current[idx] = el;
                              }}
                              className={`mx-auto w-full border-t border-customGold ${idx === pastEvents.length - 1 ? "border-b" : ""}`}
                            >
                              <EventCard
                                key={idx}
                                event={event}
                                preloadedMedia={
                                  preloadedMedia.get(
                                    event._id,
                                  ) as PreloadedMedia
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex w-full flex-col items-center justify-center text-center">
                        <EmptyMessage
                          message="No past events to display."
                          refProp={pastEmptyMessageRef}
                        />
                      </div>
                    )}
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
