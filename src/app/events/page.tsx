"use client";
import { useState, useEffect, useRef } from "react";
import EventCard from "@/components/event-card/EventCard";
import { useRouter } from "next/navigation";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import SideMenu from "@/components/side-menu/SideMenu";
import { Button } from "@mui/material";
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
  const router = useRouter();
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
      y: 50,
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

  const handleAboutScroll = async (e: React.MouseEvent) => {
    e.preventDefault();

    await router.push("/");
    setTimeout(() => {
      const aboutSection = document.getElementById("about-section");

      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col items-center p-3 pb-24 md:w-screen md:px-[275px] md:pt-6"
      >
        <div
          id="events-heading"
          className="w-[90vw] border-b-2 border-customCream pb-3 text-3xl text-customCream opacity-0 md:hidden md:pb-6"
        >
          <div>
            <Button onClick={handleAboutScroll}>
              <ArrowBackIos className="mr-6 text-customCream" />
              <span className="font-bigola text-customCream">Events</span>
            </Button>
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
            {events.map((event, index) => (
              <div
                key={event._id}
                ref={(el) => {
                  eventRefs.current[index] = el;
                }}
                className={`max-w-90vw border-customCream opacity-0 md:w-fit ${index === 0 ? "md:border-t-2" : "border-t-2"} ${
                  index === events.length - 1 ? "border-b-2" : ""
                }`}
              >
                <EventCard
                  fetchEvents={fetchEvents}
                  key={index}
                  event={event}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
