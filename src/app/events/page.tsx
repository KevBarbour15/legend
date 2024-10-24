"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Event } from "@/types/events";

import EventCard from "@/components/event-card/EventCard";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";
import Loading from "@/components/loading/Loading";

import gsap from "gsap";

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
    if (!containerRef.current) return;

    const currentRefs =
      activeTab === "upcoming" ? upcomingEventRefs : pastEventRefs;
    const currentEmptyRef =
      activeTab === "upcoming" ? upcomingEmptyMessageRef : pastEmptyMessageRef;

    if (loading) {
      gsap.fromTo(
        "#event-subheading",
        { opacity: 0 },
        { opacity: 1, duration: 0.25 },
      );
    }

    if (!loading && displayEvents) {
      if (currentRefs.current.length > 0) {
        gsap.set(currentRefs.current, { x: "50%", opacity: 0, rotateX: 45 });
        gsap.to(currentRefs.current, {
          delay: 0.15,
          duration: 0.4,
          stagger: 0.125,
          x: 0,
          opacity: 1,
          rotateX: 0,
        });
      } else if (currentEmptyRef.current) {
        gsap.set(currentEmptyRef.current, { opacity: 0, scale: 0.95 });
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
      setProgress(generateProgress(1, 35));
      const response = await fetch("/api/events");

      if (!response.ok) {
        setProgress(0);
        throw new Error("Failed to fetch events.");
      }
      setProgress(generateProgress(36, 75));

      const data: Event[] = await response.json();

      setProgress(generateProgress(76, 95));

      setEvents(data);
    } catch (error) {
      setProgress(0);
      console.log("Error: ", error);
      setError("Failed to fetch events.");
    } finally {
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setLoading(false), 200);
        setTimeout(() => setDisplayEvents(true), 350);
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
      <h2 className="mb-6 mt-3 font-bigola text-3xl text-customGold md:text-4xl">
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
        className="z-10 flex w-screen flex-col items-center justify-center overflow-y-auto p-3 pb-20 md:pb-6 md:pl-[250px] md:pr-6 md:pt-6"
      >
        <MobileHeading section={"Events"} />
        {loading ? (
          <Loading progress={progress} message={"Loading events..."} />
        ) : (
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

            <TabsContent value="upcoming" className="w-full">
              {upcomingEvents.length > 0 ? (
                <>
                  {upcomingEvents.map((event, index) => (
                    <div
                      className="mb-6 opacity-0"
                      key={event._id}
                      ref={(el) => {
                        upcomingEventRefs.current[index] = el;
                      }}
                    >
                      <EventCard key={index} event={event} />
                    </div>
                  ))}
                </>
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
                <>
                  {pastEvents.map((event, index) => (
                    <div
                      key={event._id}
                      ref={(el) => {
                        pastEventRefs.current[index] = el;
                      }}
                      className="mb-6 opacity-0"
                    >
                      <EventCard key={index} event={event} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex w-full flex-col items-center justify-center text-center">
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
