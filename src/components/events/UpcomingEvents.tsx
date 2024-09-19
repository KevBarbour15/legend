"use client";
import { useState, useRef, useEffect } from "react";
import { formatTime } from "@/utils/time";
import EditEventModal from "../edit-event-modal/EditEventModal";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";

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

const UpcomingEventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const eventsTL = useRef<gsap.core.Timeline | null>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);

  const handleDeleteOpen = () => setOpenDelete(true);
  const handleDeleteClose = () => setOpenDelete(false);
  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);
  const handleImageModalOpen = () => setOpenImageModal(true);
  const handleImageModalClose = () => setOpenImageModal(false);

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
    .filter((event) => new Date(event.date).getTime() >= new Date().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div
      ref={containerRef}
      className="z-10 flex flex-col items-center py-6 text-black"
    >
      {loading ? (
        <h2
          id="event-subheading"
          className="my-6 font-hypatia text-3xl lg:text-4xl"
        >
          Loading events...
        </h2>
      ) : events.length === 0 ? (
        <h2 id="no-events" className="my-5 font-hypatia text-3xl lg:text-4xl">
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
              <Accordion type="single" collapsible className="w-[400px]">
                <AccordionItem value={`Event ${index}`}>
                  <AccordionTrigger>
                    <Typography className="font-hypatia text-xl">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        timeZone: "UTC",
                      })}
                    </Typography>
                  </AccordionTrigger>
                  <AccordionContent className="border-t border-black pt-3">
                    <Typography className="font-hypatia text-2xl">
                      {event.title}
                    </Typography>
                    <Typography className="font-hypatia text-lg">
                      {formatTime(event.time)}
                    </Typography>
                    <Typography className="font-hypatia text-lg">
                      {event.description}
                    </Typography>

                    {event.is_photo ? (
                      <div className="p-0">
                        <img
                          src={event.image_url}
                          alt="event"
                          className="h-auto w-full border border-black object-cover"
                        ></img>
                      </div>
                    ) : (
                      <div className="border p-0">
                        <video
                          src={event.image_url}
                          className="aspect-square h-auto w-full border border-black object-cover object-center"
                          loop
                          autoPlay
                          muted
                          playsInline
                        ></video>
                      </div>
                    )}
                    <div className="flex w-full justify-end pt-3">
                      <Button
                        className="mr-6 font-hypatia"
                        onClick={handleEditOpen}
                      >
                        Edit
                      </Button>
                      <Button
                        className="font-hypatia"
                        onClick={handleDeleteOpen}
                      >
                        Delete
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ))}
        </>
      )}
    </div>
  );
};

export default UpcomingEventsList;
