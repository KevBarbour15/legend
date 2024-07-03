"use client";
import React, { useState, useEffect } from "react";
import EventCard from "@/components/event-card/EventCard";

interface Event {
  title: string;
  date: string;
  time: string;
  description: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // need to fetch events from the API and make events cards
  // sort events by date, current first
  // if no events, display a message

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
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="flex flex-col w-screen justify-center items-center text-center">
      {loading ? (
        <h1 className="font-bigola text-customCream text-6xl">
          Loading events...
        </h1>
      ) : events.length === 0 ? (
        <h1 className="font-bigola  text-customCream text-6xl">
          Stay tuned for upcoming events...
        </h1>
      ) : (
        <>
          <h1 className="font-bigola  text-customCream text-6xl">
            Upcoming Events
          </h1>
          {sortedEvents.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </>
      )}
    </div>
  );
}
