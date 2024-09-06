"use client";
import { useState, useEffect, useRef } from "react";
import EventCard from "@/components/event-card/EventCard";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import SideMenu from "@/components/side-menu/SideMenu";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
  image_url: string;
  isPublic: boolean;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const eventsTL = useRef<gsap.core.Timeline | null>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set("#events-title", {
      opacity: 0,
      scale: 0.95,
    });

    gsap.set("#no-events", {
      opacity: 0,
      scale: 0.95,
    });

    eventRefs.current.forEach((ref) => {
      gsap.set(ref, {
        opacity: 0,
        scale: 0.95,
        y: 50,
      });
    });

    gsap.fromTo(
      "#event-subheader",
      { opacity: 0 },
      { opacity: 1, duration: 0.15, delay: 0.1 },
    );

    if (!loading && eventRefs.current.length > 0) {
      eventsTL.current = gsap
        .timeline({})
        .to(
          "#events-title",
          {
            duration: 0.15,
            opacity: 1,
            scale: 1,
            ease: "linear",
            pin: true,
          },
          0.15,
        )
        .to(
          eventRefs.current,
          {
            duration: 0.35,
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.15,
          },
          0.3,
        );
    }

    if (!loading && eventRefs.current.length == 0) {
      eventsTL.current = gsap
        .timeline({})
        .to(
          "#events-title",
          {
            duration: 0.35,
            opacity: 1,
            scale: 1,
            ease: "linear",
            pin: true,
          },
          0.35,
        )
        .to(
          "#no-events",
          {
            duration: 0.35,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
          },
          0.7,
        );
    }
  }, [events]);

  const fetchEvents = async () => {
    // logic to fetch events goes here
    try {
      const response = await fetch("/api/events");

      if (!response.ok) {
        throw new Error("Failed to fetch events.");
      }

      const data: Event[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.log("Error: ", error);
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // sort events by date
  const sortedEvents = events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div
      ref={containerRef}
      className="z-10 flex w-screen flex-col items-center"
    >
      <div></div>
      {loading ? (
        <h1
          id="event-subheader"
          className="m-6 flex flex-col p-5 text-center font-bigola text-4xl text-customWhite opacity-0 lg:w-50vw xl:w-45vw xxl:w-40vw"
        >
          Loading events...
        </h1>
      ) : events.length === 0 ? (
        <h1
          id="no-events"
          className="m-6 flex flex-col p-6 text-center font-bigola text-4xl text-customWhite opacity-0 lg:w-50vw xl:w-45vw xxl:w-40vw"
        >
          Stay tuned for upcoming events...
        </h1>
      ) : (
        <>
          {sortedEvents.map((event, index) => (
            <div
              key={event._id}
              ref={(el) => {
                eventRefs.current[index] = el;
              }}
              className="opacity-0"
            >
              <EventCard
                length={sortedEvents.length}
                fetchEvents={fetchEvents}
                key={index}
                event={event}
                inDashboard={false}
                index={index}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
