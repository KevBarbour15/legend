"use client";
import React, { useState, useEffect } from "react";
import EventCard from "@/components/event-card/EventCard";

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

  const fetchEvents = async () => {
    // logic to fetch events goes here
    try {
      const response = await fetch(`/api/events?action=${"getEvents"}`);

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
    <div className="flex w-screen flex-col items-center justify-center pt-135 text-center">
      {loading ? (
        <h1 className="w-90vw font-bigola text-4xl text-customCream lg:text-5xl">
          Loading events...
        </h1>
      ) : events.length === 0 ? (
        <h1 className="w-90vw font-bigola text-4xl text-customCream lg:text-5xl">
          Stay tuned for upcoming events...
        </h1>
      ) : (
        <>
          <h1 className="w-90vw font-bigola text-4xl text-customCream lg:text-5xl">
            Upcoming Events
          </h1>
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
