"use client";
import { useState, useEffect, useRef } from "react";
import EventCard from "@/components/event-card/EventCard";
import Link from "next/link";
//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { formatInTimeZone, toZonedTime } from "date-fns-tz";

import { format } from "date-fns";

import SideMenu from "@/components/side-menu/SideMenu";
import { ArrowBackIos } from "@mui/icons-material";

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
    gsap.set("#events-heading", {
      opacity: 0,
      y: -15,
    });

    gsap.set("#no-events", {
      opacity: 0,
      y: 15,
    });

    gsap.fromTo(
      "#event-subheading",
      { opacity: 0, y: 15 },
      { opacity: 1, duration: 0.15, delay: 0.1, ease: "sine.inOut", y: 0 },
    );

    gsap.set(eventRefs.current, {
      opacity: 0,
      y: 20,
    });

    if (!loading && eventRefs.current.length > 0) {
      eventsTL.current = gsap
        .timeline({})
        .to(
          "#events-heading",
          {
            duration: 0.15,
            opacity: 1,
            ease: "sine.inOut",
            y: 0,
          },
          0.05,
        )
        .to(
          eventRefs.current,
          {
            duration: 0.25,
            opacity: 1,
            stagger: 0.1,
            y: 0,
            ease: "sine.inOut",
          },
          0.15,
        );
    }

    if (!loading && eventRefs.current.length == 0) {
      eventsTL.current = gsap
        .timeline({})
        .to(
          "#events-heading",
          {
            duration: 0.35,
            opacity: 1,
            ease: "sine.inOut",
            y: 0,
          },
          0.15,
        )
        .to(
          "#no-events",
          {
            duration: 0.35,
            opacity: 1,
            ease: "sine.inOut",
            y: 0,
          },
          0.35,
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

  const californiaTimeZone = "America/Los_Angeles";

  const sortedEvents = events
    .filter((event) => {
      
      const eventDate = toZonedTime(new Date(event.date), californiaTimeZone);


      const today = toZonedTime(new Date(), californiaTimeZone);

    
      const formattedEventDate = formatInTimeZone(
        eventDate,
        californiaTimeZone,
        "yyyy-MM-dd",
      );
      const formattedToday = formatInTimeZone(
        today,
        californiaTimeZone,
        "yyyy-MM-dd",
      );

    
      return (
        new Date(formattedEventDate).getTime() >=
        new Date(formattedToday).getTime()
      );
    })
    .sort((a, b) => {
      
      const eventDateA = toZonedTime(new Date(a.date), californiaTimeZone);
      const eventDateB = toZonedTime(new Date(b.date), californiaTimeZone);
      return eventDateA.getTime() - eventDateB.getTime();
    });

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-lg"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col items-center pb-24 pt-3 md:w-screen md:px-[275px] md:pt-6"
      >
        <div
          id="events-heading"
          className="w-[90vw] border-b-2 border-customCream pb-3 text-3xl text-customCream opacity-0 md:hidden md:pb-6"
        >
          <div className="menu-link">
            <Link href={"/"}>
              <ArrowBackIos className="mr-6" />
              <span className="font-bigola">Events</span>
            </Link>
          </div>
        </div>
        <h2
          id="events-heading"
          className="mb-6 hidden font-bigola text-4xl text-customCream opacity-0 md:flex lg:text-5xl"
        >
          Events
        </h2>
        {loading ? (
          <h2
            id="event-subheading"
            className="m-6 flex flex-col p-6 text-center font-hypatia text-3xl text-customCream opacity-0 lg:w-50vw lg:text-4xl xl:w-45vw xxl:w-40vw"
          >
            Loading events...
          </h2>
        ) : events.length === 0 ? (
          <h2
            id="no-events"
            className="m-6 flex flex-col p-6 text-center font-hypatia text-3xl text-customCream opacity-0 lg:w-50vw lg:text-4xl xl:w-45vw xxl:w-40vw"
          >
            Stay tuned for upcoming events...
          </h2>
        ) : (
          <div>
            {sortedEvents.map((event, index) => (
              <div
                key={event._id}
                ref={(el) => {
                  eventRefs.current[index] = el;
                }}
                className={`max-w-90vw border-customCream opacity-0 md:w-fit ${index === 0 ? "md:border-t-2" : "border-t-2"} ${
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
