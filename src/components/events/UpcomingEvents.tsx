import React, { useState, useRef, useEffect } from "react";
import { formatTime } from "@/utils/time";

import EditEventModal from "../edit-event-modal/EditEventModal";
import DeleteEventModal from "../delete-event-modal/DeleteEventModal";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

const UpcomingEventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
  };

  const closeEditModal = () => {
    setEditingEvent(null);
  };

  const openDeleteModal = (event: Event) => {
    setDeletingEvent(event);
  };

  const closeDeleteModal = () => {
    setDeletingEvent(null);
  };

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
    .filter((event) => new Date(event.date).getTime() >= new Date().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div
      ref={containerRef}
      className="z-10 flex w-screen flex-col p-3 text-black md:p-6"
    >
      {loading ? (
        <h2
          id="event-subheading"
          className="text-center font-bigola text-4xl text-black"
        >
          Loading events...
        </h2>
      ) : events.length === 0 ? (
        <h2
          id="event-subheading"
          className="text-center font-bigola text-4xl text-black"
        >
          No events found.
        </h2>
      ) : (
        <>
          {sortedEvents.map((event, index) => (
            <div key={event._id}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`Event ${index}`}>
                  <AccordionTrigger>
                    <p className="font-bigola text-xl">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        timeZone: "UTC",
                      })}
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="flex w-full border-t border-black py-3">
                    <Card className="flex w-full flex-col p-3 md:flex-row md:justify-between">
                      <div className="flex flex-col justify-between">
                        <div className="block">
                          <p className="pb-3 text-2xl font-bold">
                            {event.title}
                          </p>
                          <p className="pb-3">{formatTime(event.time)}</p>
                          <p className="pb-3">{event.description}</p>
                        </div>
                        <div className="flex w-full justify-start pb-3 md:pb-0">
                          <Button
                            className="mr-3"
                            onClick={() => openEditModal(event)}
                            variant="outline"
                          >
                            Edit
                          </Button>
                          <Button
                            className=""
                            onClick={() => openDeleteModal(event)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-square w-full p-0 md:ml-6 md:w-[275px] md:flex-shrink-0">
                        {event.is_photo ? (
                          <img
                            src={event.image_url}
                            alt="event"
                            className="aspect-square h-full w-full border border-black object-cover object-center"
                          />
                        ) : (
                          <video
                            src={event.image_url}
                            className="aspect-square h-auto w-full border border-black object-cover object-center"
                            loop
                            autoPlay
                            muted
                            playsInline
                          />
                        )}
                      </div>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
          {editingEvent && (
            <EditEventModal
              closeEditModal={closeEditModal}
              fetchEvents={fetchEvents}
              openEditModal={true}
              event={editingEvent}
            />
          )}
          {deletingEvent && (
            <DeleteEventModal
              fetchEvents={fetchEvents}
              openDeleteModal={true}
              closeDeleteModal={closeDeleteModal}
              event={deletingEvent}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UpcomingEventsList;
