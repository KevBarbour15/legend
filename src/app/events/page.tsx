"use client";
import { useState, useEffect, useRef } from "react";

import EventCard from "@/components/event-card/EventCard";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Progress } from "@/components/ui/progress";
interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
  image_url: string;
  is_photo: boolean;
  is_public: boolean;
}

function generateProgress(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const eventsTL = useRef<gsap.core.Timeline | null>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState<number>(0);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (loading) {
      gsap.fromTo(
        "#event-subheading",
        { opacity: 0 },
        { opacity: 1, ease: "linear", y: 0, delay: 0.05 },
      );
    }

    gsap.set(eventRefs.current, {
      x: "50%",
      opacity: 0,
    });

    if (!loading && eventRefs.current.length > 0) {
      eventsTL.current = gsap
        .timeline({})
        .to(
          "#events-heading",
          {
            duration: 0.15,
            opacity: 1,
            ease: "sine.inOut",
            y: 0,
          },
          0.05,
        )
        .to(
          eventRefs.current,
          {
            duration: 0.25,
            stagger: 0.05,
            x: 0,
            opacity: 1,
          },
          0.15,
        );
    }
  }, [events]);

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
        setTimeout(() => setLoading(false), 500);
      }, 200);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col items-center justify-center p-3 pb-16 md:pl-[300px] md:pr-6 md:pt-6"
      >
        <MobileHeading section={"Events"} />
        {loading ? (
          <div
            id="event-subheading"
            className="flex h-[75vh] w-full flex-col items-center justify-center opacity-0"
          >
            <h2 className="mb-6 mt-3 font-bigola text-4xl text-customCream md:text-5xl">
              Loading events...
            </h2>
            <Progress
              value={progress}
              className="w-[50%] max-w-[350px] text-customCream"
            />
          </div>
        ) : events.length === 0 ? (
          <div
            id="event-subheading"
            className="flex h-[75vh] w-full flex-col items-center justify-center"
          >
            <h2 className="mt-3 font-bigola text-4xl text-customCream">
              Stay tuned for upcoming events!
            </h2>
          </div>
        ) : (
          <div className="w-full">
            {events.map((event, index) => (
              <div
                key={event._id}
                ref={(el) => {
                  eventRefs.current[index] = el;
                }}
                className={`w-full border-customGold opacity-0 ${index === 0 ? "md:border-t" : "border-t"} ${
                  index === events.length - 1 ? "border-b" : ""
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
        )}
      </div>
    </>
  );
}
