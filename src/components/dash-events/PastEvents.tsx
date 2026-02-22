"use client";
import { useState, useEffect, useRef, useMemo } from "react";

import { Event } from "@/data/events";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { generateProgress } from "@/utils/progress";

import EventsTable from "@/components/dash-events/EventsTable";
import Loading from "@/components/loading/Loading";

const PastEventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);

  useGSAP(() => {
    if (!containerRef.current) return;
    if (loading) return;
    gsap.fromTo(
      "#events-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.15, delay: 0.15, ease: "sine.inOut" },
    );
  }, [loading]);

  const updateProgress = (start: number, end: number, delay = 0) => {
    setTimeout(() => setProgress(generateProgress(start, end)), delay);
  };

  const fetchEvents = async () => {
    try {
      updateProgress(34, 66);
      const response = await fetch("/api/events");

      if (!response.ok) {
        setProgress(0);
        setError(new Error(`Failed to fetch events: ${response.statusText}`));
        setLoading(false);
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data: { upcoming: Event[]; past: Event[] } = await response.json();
      updateProgress(67, 99, 750);
      setEvents(data.past);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Unknown error occurred");
      console.error("Error: ", err);
      setError(err);
      setProgress(0);
    } finally {
      updateProgress(100, 100);
      setTimeout(() => setLoading(false), 750);
    }
  };

  useEffect(() => {
    setProgress(generateProgress(1, 33));
    fetchEvents();
  }, []);

  return (
    <div ref={containerRef} id="events-container" className="block text-black">
      {loading ? (
        <Loading
          progress={progress}
          message="Loading events..."
          textColor="black"
          borderColor="border-black"
        />
      ) : error ? (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <h2 className="mb-6 text-3xl md:text-4xl">{error.message}</h2>
        </div>
      ) : !loading && events.length === 0 ? (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <h2 className="mb-6 text-3xl md:text-4xl">No events found.</h2>
        </div>
      ) : (
        <div className="rounded-md border border-stone-200 bg-white">
          <EventsTable events={events} fetchEvents={fetchEvents} />
        </div>
      )}
    </div>
  );
};

export default PastEventsList;
