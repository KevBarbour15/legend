"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Event } from "@/types.ts";
import EventCard from "@/components/event-card/EventCard";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";
import gsap from "gsap";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function generateProgress(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [displayEvents, setDisplayEvents] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const containerRef = useRef<HTMLDivElement>(null);
  const upcomingEventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pastEventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const upcomingEmptyMessageRef = useRef<HTMLDivElement>(null);
  const pastEmptyMessageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);

  const animateEvents = useCallback(() => {
    const currentRefs =
      activeTab === "upcoming" ? upcomingEventRefs : pastEventRefs;
    const currentEmptyRef =
      activeTab === "upcoming" ? upcomingEmptyMessageRef : pastEmptyMessageRef;

    if (loading) {
      gsap.fromTo(
        "#event-subheading",
        { opacity: 0 },
        { opacity: 1, ease: "linear", y: 0, delay: 0.05 },
      );
    }

    if (!loading && displayEvents) {
      if (currentRefs.current.length > 0) {
        gsap.set(currentRefs.current, { x: "50%", opacity: 0 });
        gsap.to(currentRefs.current, {
          delay: 0.15,
          duration: 0.25,
          stagger: 0.05,
          x: 0,
          opacity: 1,
        });
      } else if (currentEmptyRef.current) {
        gsap.set(currentEmptyRef.current, { opacity: 0, scale: 0.75 });
        gsap.to(currentEmptyRef.current, {
          delay: 0.15,
          duration: 0.25,
          scale: 1,
          opacity: 1,
        });
      }
    }
  }, [loading, displayEvents, activeTab]);

  useEffect(() => {
    animateEvents();
  }, [animateEvents, activeTab]);

  const fetchEvents = async () => {
    try {
      setProgress(generateProgress(5, 35));
      const response = await fetch("/api/events");

      if (!response.ok) {
        setProgress(0);
        throw new Error("Failed to fetch events.");
      }

      const data: Event[] = await response.json();
      setEvents(data);
    } catch (error) {
      setProgress(0);
      console.log("Error: ", error);
      setError("Failed to fetch events.");
    } finally {
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setLoading(false), 200);
        setTimeout(() => setDisplayEvents(true), 250);
      }, 300);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filterEvents = (type: "upcoming" | "past") => {
    const now = new Date();
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return type === "upcoming" ? eventDate >= now : eventDate < now;
    });
  };

  const upcomingEvents = filterEvents("upcoming");
  const pastEvents = filterEvents("past");

  const EmptyMessage = ({
    message,
    refProp,
  }: {
    message: string;
    refProp: React.RefObject<HTMLDivElement>;
  }) => (
    <div
      ref={refProp}
      className="flex h-[75vh] w-full flex-col items-center justify-center opacity-0"
    >
      <h2 className="mt-3 font-bigola text-4xl text-customCream">{message}</h2>
    </div>
  );

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col items-center justify-center p-3 pb-20 md:pb-6 md:pl-[300px] md:pr-6 md:pt-6"
      >
        <MobileHeading section={"Events"} />
        {loading ? (
          <div
            id="event-subheading"
            className="flex h-[75vh] w-full flex-col items-center justify-center opacity-0"
          >
            <h2 className="mb-6 mt-3 font-bigola text-3xl text-customCream md:text-4xl">
              Loading events...
            </h2>
            <Progress
              value={progress}
              className="w-[75vw] max-w-[350px] text-customCream"
            />
          </div>
        ) : (
          <Tabs
            defaultValue="upcoming"
            className="flex w-full flex-col items-center"
            onValueChange={(value) =>
              setActiveTab(value as "upcoming" | "past")
            }
          >
            <TabsList className="my-3 grid w-full grid-cols-2 font-bigola md:mb-6 md:mt-0 md:w-[400px]">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
            <TabsContent
              value="upcoming"
              className={`w-full ${pastEvents.length > 0 ? "border-t border-customGold md:border-0" : ""}`}
            >
              {upcomingEvents.length > 0 ? (
                <div>
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={event._id}
                      ref={(el) => {
                        upcomingEventRefs.current[index] = el;
                      }}
                      className={`w-full border-customGold opacity-0 ${index === 0 ? "md:border-t" : "border-t"} ${
                        index === upcomingEvents.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <EventCard
                        fetchEvents={fetchEvents}
                        key={index}
                        event={event}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[50vh] w-full flex-col items-center justify-center text-center">
                  <EmptyMessage
                    message="Stay tuned for upcoming events!"
                    refProp={upcomingEmptyMessageRef}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="past"
              className={`w-full ${pastEvents.length > 0 ? "border-t border-customGold md:border-0" : ""}`}
            >
              {pastEvents.length > 0 ? (
                <div>
                  {pastEvents.map((event, index) => (
                    <div
                      key={event._id}
                      ref={(el) => {
                        pastEventRefs.current[index] = el;
                      }}
                      className={`w-full border-customGold opacity-0 ${index === 0 ? "md:border-t" : "border-t"} ${
                        index === pastEvents.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <EventCard
                        fetchEvents={fetchEvents}
                        key={index}
                        event={event}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[50vh] w-full flex-col items-center justify-center text-center">
                  <EmptyMessage
                    message="No past events to display."
                    refProp={pastEmptyMessageRef}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}
