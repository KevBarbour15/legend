"use client";

import React, { useState, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Event } from "@/data/events";
import { DayContentProps } from "react-day-picker";
import { format } from "date-fns";
import EventCard from "@/components/event-card/EventCard";
interface CalendarViewProps {
  events: Event[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeMonth, setActiveMonth] = useState<Date>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

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

  const hasEventsMatcher = useCallback(
    (day: Date) => getEventsForDate(day).length > 0,
    [getEventsForDate],
  );

  const renderDayContent = useCallback(
    (props: DayContentProps) => {
      const dayEvents = getEventsForDate(props.date);
      const hasEvents = dayEvents.length > 0;

      return (
        <div className="relative flex h-full w-full overflow-hidden">
          <span
            className={`absolute right-1.5 top-1.5 z-30 text-2xl text-shadow-custom ${
              hasEvents ? "text-customWhite" : "text-customNavy"
            }`}
          >
            {props.date.getDate()}
          </span>

          {hasEvents && (
            <div className="relative flex h-full w-full flex-col">
              {dayEvents.map((event, index) => (
                <div
                  key={event._id}
                  className={`h-full min-h-0 w-full flex-1 basis-0 ${dayEvents.length > 1 && index !== dayEvents.length - 1 ? "border-b border-neutral-400/20" : ""}`}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
    [getEventsForDate],
  );

  return (
    <div className="h-full w-full">
      <Calendar
        mode="single"
        selected={selectedDate ?? undefined}
        onSelect={(date) => {
          if (date) {
            setSelectedDate(date);
          }
        }}
        month={activeMonth}
        onMonthChange={(date) => date && setActiveMonth(date)}
        className="border-0 border-neutral-400/20 p-0"
        classNames={{
          months: "h-full",
          month: "flex h-full flex-col gap-4",
          table:
            "min-h-[60vh] md:min-h-[75vh] h-full w-auto border-l border-t bg-neutral-300/15 backdrop-blur-[1px] box-shadow-card",
          head_row: "grid grid-cols-7 border-b",
          row: "mt-0 grid grid-cols-7 h-[16.6667%]",
          head_cell:
            "text-2xl  border-r text-right pr-1.5 text-customNavy text-shadow-custom",
          cell: "p-0 md:aspect-[6/7.5] border-r border-b ",
          day: "flex h-full w-full items-center",
          caption_label: "text-3xl text-shadow-custom text-customNavy",
          nav_button:
            "p-2 rounded-full border border bg-neutral-300/15 backdrop-blur-[1px] box-shadow-card lg:hover:bg-customGold lg:hover:border-customNavy transition-all duration-300",
        }}
        components={{
          DayContent: renderDayContent,
        }}
        modifiers={{ hasEvents: hasEventsMatcher }}
      />
    </div>
  );
}
