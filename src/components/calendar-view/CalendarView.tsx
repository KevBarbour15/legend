"use client";

import React, { useState, useCallback } from "react";
import Calendar from "react-calendar";
import { Event } from "@/data/events";
import EventCard from "@/components/event-card/EventCard";
import { format } from "date-fns";
import "react-calendar/dist/Calendar.css";

interface CalendarViewProps {
  events: Event[];
  preloadedMedia?: Map<string, any>;
}

export default function CalendarView({
  events,
  preloadedMedia,
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalEvents, setModalEvents] = useState<Event[]>([]);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  // Get events for a specific date
  const getEventsForDate = useCallback(
    (date: Date): Event[] => {
      const dateKey = format(date, "yyyy-MM-dd");
      return events.filter((event) => {
        const eventDate = new Date(event.date);
        return format(eventDate, "yyyy-MM-dd") === dateKey;
      });
    },
    [events],
  );

  // Custom tile content to show EventCard components
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const dayEvents = getEventsForDate(date);

    if (dayEvents.length === 0) return null;

    // Show the first event as the main tile content
    const mainEvent = dayEvents[0];

    return (
      <div className="absolute inset-0 p-1">
        {/* Mini EventCard */}
        <div className="h-full w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
          {/* Event Image */}
          {mainEvent.image_url && (
            <div className="h-12 w-full overflow-hidden">
              <img
                src={mainEvent.image_url}
                alt={mainEvent.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Event Content */}
          <div className="p-2">
            <h4 className="mb-1 line-clamp-2 text-xs font-semibold leading-tight text-customNavy">
              {mainEvent.title}
            </h4>
            <p className="mb-1 text-xs text-gray-600">{mainEvent.time}</p>

            {/* Show count if multiple events */}
            {dayEvents.length > 1 && (
              <div className="flex items-center justify-center">
                <span className="rounded-full bg-customGold/10 px-2 py-1 text-xs font-bold text-customGold">
                  +{dayEvents.length - 1} more
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Add click event listeners to calendar tiles
  React.useEffect(() => {
    const calendarElement = document.querySelector(".react-calendar");
    if (!calendarElement) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if we're clicking on a tile or its content
      const tileElement = target.closest(".react-calendar__tile");
      if (tileElement) {
        const dateAttr = tileElement.getAttribute("data-date");
        if (dateAttr) {
          const date = new Date(dateAttr);
          handleTileClick(date);
        }
      }
    };

    calendarElement.addEventListener("click", handleClick);

    return () => {
      calendarElement.removeEventListener("click", handleClick);
    };
  }, [events]);

  // Handle date selection
  const handleDateChange = (value: Date | Date[]) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // Handle tile click to show event modal
  const handleTileClick = useCallback((date: Date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      setModalEvents(dayEvents);
      setModalDate(date);
      setShowEventModal(true);
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6 text-center">
        <h2 className="font-bigola text-3xl text-customNavy">Event Calendar</h2>
        <p className="mt-2 text-gray-600">
          Click on any date with events to see details
        </p>
      </div>

      <div className="w-full">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          className="w-full rounded-lg border-0 bg-white p-4 shadow-lg"
          tileClassName={({ date, view }) => {
            if (view !== "month") return "";

            const dayEvents = getEventsForDate(date);
            const isToday =
              format(new Date(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
            const isSelected =
              selectedDate &&
              format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

            let classes =
              "relative w-full hover:bg-gray-50 transition-colors cursor-pointer h-full";

            if (isToday) classes += " bg-customGold/20";
            if (isSelected) classes += " bg-customNavy text-white";
            if (dayEvents.length > 0) {
              classes += " font-semibold react-calendar__tile--has-events";
            }

            return classes;
          }}
        />
      </div>

      {/* Event Modal */}
      {showEventModal && modalDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute right-4 top-4 rounded-full bg-gray-200 p-2 text-gray-600 hover:bg-gray-300"
            >
              ✕
            </button>

            {/* Modal header */}
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h2 className="font-bigola text-2xl text-customNavy">
                Events for {format(modalDate, "EEEE, MMMM d, yyyy")}
              </h2>
              <p className="mt-2 text-gray-600">
                {modalEvents.length} event{modalEvents.length !== 1 ? "s" : ""}{" "}
                scheduled
              </p>
            </div>

            {/* Events list */}
            <div className="space-y-4">
              {modalEvents.map((event) => (
                <div
                  key={event._id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start gap-4">
                    {event.image_url && (
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 font-hypatia text-xl text-customNavy">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>🕐 {event.time}</p>
                        {event.description && (
                          <p className="text-gray-700">{event.description}</p>
                        )}
                        {event.notes && (
                          <p className="italic text-gray-600">
                            Note: {event.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
