"use client";
import { useState, useEffect, useRef } from "react";
import EventCard from "@/components/event-card/EventCard";
import { useRouter } from "next/navigation";

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
      const aboutSection = document.getElementById("about-content");
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
        className="z-10 flex w-screen flex-col items-center justify-center p-3 pb-24 md:pl-[300px] md:pr-6 md:pt-6"
      >
        <div
          id="events-heading"
          className="w-full border-b-2 border-customCream pb-3 text-3xl text-customCream opacity-0 md:hidden md:pb-6"
        >
          <div>
            <Button onClick={handleAboutScroll}>
              <ArrowBackIos className="mr-6 text-customCream" />
              <span className="font-bigola text-lg capitalize text-customCream">
                Events
              </span>
            </Button>
          </div>
        </div>

        {loading ? (
          <h2
            id="event-subheading"
            className="font-bigola text-5xl text-customCream opacity-0"
          >
            Loading events...
          </h2>
        ) : events.length === 0 ? (
          <h2
            id="no-events"
            className="font-bigola text-5xl text-customCream opacity-0"
          >
            Stay tuned for upcoming events...
          </h2>
        ) : (
          <div className="w-90vw md:w-full">
            {events.map((event, index) => (
              <div
                key={event._id}
                ref={(el) => {
                  eventRefs.current[index] = el;
                }}
                className={`w-full border-customCream opacity-0 ${index === 0 ? "md:border-t" : "border-t"} ${
                  index === events.length - 1 ? "border-b" : ""
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
