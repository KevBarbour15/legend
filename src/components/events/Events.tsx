"use client";
import React, { useState, useEffect } from "react";
import EventCard from "@/components/event-card/EventCard";

interface Event {
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
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
    <div className="flex w-screen flex-col items-center justify-center text-center">
      {loading ? (
        <h1 className="mt-3.5 font-bigola text-4xl text-customCream lg:text-5xl">
          Loading events...
        </h1>
      ) : events.length === 0 ? (
        <h1 className="mt-3.5 font-bigola text-4xl text-customCream lg:text-5xl">
          No events found.
        </h1>
      ) : (
        <>
          <h1 className="mt-3.5 font-bigola text-4xl text-customCream lg:text-5xl">
            Upcoming Events
          </h1>
          {sortedEvents.map((event, index) => (
            <EventCard key={index} event={event} inDashboard={true} />
          ))}
        </>
      )}
    </div>
  );
};

export default EventsList;
