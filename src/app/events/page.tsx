"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Event, PreloadedMedia } from "@/data/events";

import EventCard from "@/components/event-card/EventCard";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";
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
  const [preloadedMedia, setPreloadedMedia] = useState<Map<string, string>>(
    new Map(),
  );

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

            newMap.set(event._id, img.src);
            return newMap;
          });
          resolve(img);
        };
      } else {
        const video = document.createElement("video");
        video.onloadeddata = () => {
          setPreloadedMedia((prev) => {
            const newMap = new Map(prev);
            newMap.set(event._id, video.src);
            return newMap;
          });
          resolve(video);
        };
        video.onerror = reject;
        video.src = event.image_url;
        video.load();
      }
    });
  };

  const animateEvents = useCallback(() => {
    if (!containerRef.current) return;

    const currentRefs =
      activeTab === "upcoming" ? upcomingEventRefs : pastEventRefs;
    const currentEmptyRef =
      activeTab === "upcoming" ? upcomingEmptyMessageRef : pastEmptyMessageRef;

    if (loading) {
      gsap.fromTo(
        "#event-subheading",
        { opacity: 0 },
        { opacity: 1, duration: 0.05 },
      );
      return;
    }

    gsap.fromTo("#event-tabs", { opacity: 0 }, { opacity: 1, duration: 0.35 });
    if (currentRefs.current.length > 0) {
      gsap.set("#events-container", { opacity: 0 });
      gsap.set(currentRefs.current, { opacity: 0, y: 100 });
      gsap.to("#events-container", {
        opacity: 1,
      });
      gsap.to(currentRefs.current, {
        delay: 0.35,
        duration: 0.2,
        stagger: 0.05,
        y: 0,
        opacity: 1,
        ease: "sine.inOut",
      });
    } else if (currentEmptyRef.current) {
      gsap.set(currentEmptyRef.current, { opacity: 0 });
      gsap.to(currentEmptyRef.current, {
        delay: 0.35,
        duration: 0.25,
        opacity: 1,
      });
    }
  }, [loading, activeTab]);

  useGSAP(() => {
    animateEvents();
  }, [animateEvents, activeTab]);

  const fetchEvents = async () => {
    try {
      setProgress(generateProgress(1, 25));
      const response = await fetch("/api/events", {
        cache: "force-cache",
        next: {
          revalidate: 3600,
        },
      });

      if (!response.ok) {
        setProgress(0);
        throw new Error("Failed to fetch events.");
      }
      setProgress(generateProgress(26, 50));

      const data: Event[] = await response.json();

      setProgress(generateProgress(51, 75));
      setEvents(data);
      await Promise.all(data.map(preloadMedia));
    } catch (error) {
      setProgress(0);
      console.log("Error: ", error);
      setError("Failed to fetch events.");
    } finally {
      setProgress(generateProgress(76, 95));
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }, 350);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filterEvents = (type: "upcoming" | "past") => {
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

  const upcomingEvents = filterEvents("upcoming").sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const pastEvents = filterEvents("past").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const EmptyMessage = ({
    message,
    refProp,
  }: {
    message: string;
    refProp: React.RefObject<HTMLDivElement>;
  }) => (
    <div
      ref={refProp}
      className="flex h-[50vh] w-full flex-col items-center justify-center opacity-0"
    >
      <h2 className="my-3 text-center font-bigola text-3xl text-customCream md:text-4xl">
        {message}
      </h2>
    </div>
  );

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-full min-h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 mx-auto flex w-screen flex-col items-center justify-center overflow-y-auto p-3 pb-20 md:pb-0 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]"
      >
        <MobileHeading section={"Events"} />
        {loading ? (
          <Loading
            progress={progress}
            message={"Loading events..."}
            loading={loading}
          />
        ) : (
          <div id="event-tabs" className="w-full opacity-0">
            <Tabs
              defaultValue="upcoming"
              className="flex w-full flex-col items-center"
              onValueChange={(value) =>
                setActiveTab(value as "upcoming" | "past")
              }
            >
              <TabsList className="my-6 grid w-full grid-cols-2 bg-transparent font-bigola md:mb-6 md:mt-0 md:w-[400px]">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>

              <div id="events-container" className="w-full opacity-0">
                <TabsContent value="upcoming" className="w-full">
                  {upcomingEvents.length > 0 ? (
                    <div className="space-y-3 md:space-y-6">
                      {upcomingEvents.map((event, idx) => (
                        <div
                          className="opacity-0"
                          key={event._id}
                          ref={(el) => {
                            upcomingEventRefs.current[idx] = el;
                          }}
                        >
                          <EventCard
                            key={idx}
                            event={event}
                            preloadedMedia={preloadedMedia.get(event._id) || ""}
                          />
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
                    <div className="mb-6 space-y-3 md:space-y-6">
                      {pastEvents.map((event, idx) => (
                        <div
                          key={event._id}
                          ref={(el) => {
                            pastEventRefs.current[idx] = el;
                          }}
                          className="opacity-0"
                        >
                          <EventCard
                            key={idx}
                            event={event}
                            preloadedMedia={preloadedMedia.get(event._id) || ""}
                          />
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
    </>
  );
}
