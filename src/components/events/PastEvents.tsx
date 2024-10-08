import React, { useState, useRef, useEffect } from "react";

import { Event } from "@/types/events";

import DashEventCard from "@/components/dash-event-card/DashEventCard";

import { Accordion } from "@/components/ui/accordion";

const PastEventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const filterEvents = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return events
      .filter((event) => {
        const [year, month, day] = event.date.split("-").map(Number);
        const eventDate = new Date(year, month - 1, day);
        eventDate.setHours(0, 0, 0, 0);

        return eventDate < today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const sortedEvents = filterEvents();

  return (
    <div ref={containerRef} className="flex flex-col text-black">
      {loading ? (
        <h2
          id="event-subheading"
          className="text-center font-bigola text-4xl text-black"
        >
          Loading events...
        </h2>
      ) : sortedEvents.length === 0 ? (
        <h2
          id="event-subheading"
          className="text-center font-bigola text-4xl text-black"
        >
          No events found.
        </h2>
      ) : (
        <>
          <Accordion
            type="single"
            collapsible
            className="w-full border-b border-black"
          >
            {sortedEvents.map((event, index) => (
              <div key={event._id}>
                <DashEventCard
                  event={event}
                  index={index}
                  fetchEvents={fetchEvents}
                />
              </div>
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
};

export default PastEventsList;
