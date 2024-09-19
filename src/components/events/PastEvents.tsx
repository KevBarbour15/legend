"use client";
import { useState, useRef, useEffect } from "react";
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
  is_photo: boolean;
  is_public: boolean;
}

const PastEventsList: React.FC = () => {
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
    });

    gsap.set("#no-events", {
      opacity: 0,
    });

    gsap.fromTo(
      "#event-subheading",
      { opacity: 0 },
      { opacity: 1, duration: 0.15, delay: 0.1 },
    );

    if (!loading && eventRefs.current.length > 0) {
      eventsTL.current = gsap.timeline({}).to(
        "#events-title",
        {
          duration: 0.35,
          opacity: 1,
          scale: 1,
          ease: "linear",
          pin: true,
        },
        0.35,
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
          0.15,
        )
        .to(
          "#no-events",
          {
            duration: 0.35,
            opacity: 1,
          },
          0.5,
        );
    }
  }, [events]);

  const fetchEvents = async () => {
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

  const sortedEvents = events
    .filter((event) => new Date(event.date).getTime() < new Date().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div
      ref={containerRef}
      className="z-10 flex w-screen flex-col items-center justify-center py-6 text-center"
    >
      {loading ? (
        <h2
          id="event-subheading"
          className="my-6 font-hypatia text-3xl text-customWhite lg:text-4xl"
        >
          Loading events...
        </h2>
      ) : events.length === 0 ? (
        <h2
          id="no-events"
          className="my-6 font-hypatia text-3xl text-customWhite lg:text-4xl"
        >
          No events found.
        </h2>
      ) : (
        <>
          {sortedEvents.map((event, index) => (
            <div
              key={event._id}
              ref={(el) => {
                eventRefs.current[index] = el;
              }}
              className=""
            >
              <EventCard fetchEvents={fetchEvents} key={index} event={event} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PastEventsList;
