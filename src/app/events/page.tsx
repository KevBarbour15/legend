"use client";
import { useState, useEffect, useRef } from "react";
import EventCard from "@/components/event-card/EventCard";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
  image_url: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const eventsRef = useRef<Event[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;
    // TODO: make individual animations in separate functions
    // -- use shouldAnimate to determine if animation should run
  }, []);

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
      className="flex w-screen flex-col items-center justify-center pt-135 text-center"
    >
      <h1
        id="events-title"
        className="w-90vw font-bigola text-4xl text-customCream lg:text-5xl"
      >
        Upcoming Events
      </h1>
      {loading ? (
        <h1
          id="event-subheader"
          className="m-5 flex w-85vw flex-col border-y-2 border-customGold p-5 text-center font-bigola text-4xl text-customCream opacity-0 lg:w-50vw xl:w-45vw xxl:w-40vw"
        >
          Loading events...
        </h1>
      ) : events.length === 0 ? (
        <h1
          id="event-subheader"
          className="m-5 flex w-85vw flex-col border-y-2 border-customGold p-5 text-center font-bigola text-4xl text-customCream lg:w-50vw xl:w-45vw xxl:w-40vw"
        >
          Stay tuned for upcoming events...
        </h1>
      ) : (
        <>
          {sortedEvents.map((event, index) => (
            <EventCard
              fetchEvents={fetchEvents}
              key={index}
              event={event}
              inDashboard={false}
            />
          ))}
        </>
      )}
    </div>
  );
}
