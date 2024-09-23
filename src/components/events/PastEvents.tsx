"use client";
import { useState, useRef, useEffect } from "react";
import { formatTime } from "@/utils/time";
import EditEventModal from "../edit-event-modal/EditEventModal";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

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
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const handleDeleteOpen = () => setOpenDelete(true);
  const handleDeleteClose = () => setOpenDelete(false);
  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set("#events-title", {
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
        },
        0.35,
      );
    }

    if (!loading && eventRefs.current.length == 0) {
      gsap.set("#no-events", {
        opacity: 0,
      });

      eventsTL.current = gsap
        .timeline({})
        .to(
          "#events-title",
          {
            duration: 0.35,
            opacity: 1,
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
      className="z-10 flex w-screen flex-col p-3 text-black md:py-6 md:pl-[275px] md:pr-6"
    >
      {loading ? (
        <h2
          id="event-subheading"
          className="text-center font-bigola text-4xl text-black md:text-left"
        >
          Loading events...
        </h2>
      ) : events.length === 0 ? (
        <h2
          id="no-events"
          className="text-center font-bigola text-4xl text-black md:text-left"
        >
          No events found.
        </h2>
      ) : (
        <>
          {sortedEvents.map((event, index) => (
            <>
              <EditEventModal
                handleEditClose={handleEditClose}
                fetchEvents={fetchEvents}
                openEdit={openEdit}
                event={event}
              />
              <div
                key={index}
                ref={(el) => {
                  eventRefs.current[index] = el;
                }}
              >
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
                              onClick={handleEditOpen}
                              variant="outline"
                            >
                              Edit
                            </Button>
                            <Button className="" onClick={handleDeleteOpen}>
                              Delete
                            </Button>
                          </div>
                        </div>

                        <div className="w-full p-0 md:w-[200px]">
                          {event.is_photo ? (
                            <img
                              src={event.image_url}
                              alt="event"
                              className="aspect-square h-auto w-full border border-black object-cover object-center"
                            ></img>
                          ) : (
                            <video
                              src={event.image_url}
                              className="aspect-square h-auto w-full border border-black object-cover object-center"
                              loop
                              autoPlay
                              muted
                              playsInline
                            ></video>
                          )}
                        </div>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </>
          ))}
        </>
      )}
    </div>
  );
};

export default PastEventsList;
