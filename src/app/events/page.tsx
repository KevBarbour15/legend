"use client";
import { useState, useEffect, useRef } from "react";
import EventCard from "@/components/event-card/EventCard";
import Link from "next/link";
//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import SideMenu from "@/components/side-menu/SideMenu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

export default function Events() {
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
      "#event-subheader",
      { opacity: 0 },
      { opacity: 1, duration: 0.15, delay: 0.1 },
    );

    if (!loading && eventRefs.current.length > 0) {
      eventsTL.current = gsap.timeline({}).to(
        "#events-title",
        {
          duration: 0.15,
          opacity: 1,
        },
        0.15,
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
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col py-6 md:items-center md:px-[260px] md:py-6"
      >
        <div className="pb-6 pl-6 text-3xl text-customCream md:hidden">
          <Link href={"/"}>
            <ArrowBackIcon className="mr-6" />
            <span className="font-bigola">Events</span>
          </Link>
        </div>
        <h1 className="mb-6 font-bigola text-4xl text-customCream lg:text-5xl">
          Upcoming Events
        </h1>
        {loading ? (
          <h1
            id="event-subheader"
            className="m-6 flex flex-col p-6 text-center font-hypatia text-3xl text-customCream opacity-0 lg:w-50vw lg:text-4xl xl:w-45vw xxl:w-40vw"
          >
            Loading events...
          </h1>
        ) : events.length === 0 ? (
          <h1
            id="no-events"
            className="m-6 flex flex-col p-6 text-center font-hypatia text-3xl text-customCream opacity-0 lg:w-50vw lg:text-4xl xl:w-45vw xxl:w-40vw"
          >
            Stay tuned for upcoming events...
          </h1>
        ) : (
          <div>
            {sortedEvents.map((event, index) => (
              <div
                key={event._id}
                ref={(el) => {
                  eventRefs.current[index] = el;
                }}
                className={`border-t-2 border-customCream ${
                  index === sortedEvents.length - 1 ? "border-b-2" : ""
                }`}
              >
                <EventCard
                  length={sortedEvents.length}
                  fetchEvents={fetchEvents}
                  key={index}
                  event={event}
                  inDashboard={false}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
