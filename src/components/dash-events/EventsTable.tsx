"use client";

import React, { useState } from "react";
import { Event } from "@/data/events";
import { parseEventDate } from "@/utils/date";
import { formatTime } from "@/utils/time";
import EventDetailContent from "@/components/dash-event-card/EventDetailContent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface EventsTableProps {
  events: Event[];
  fetchEvents: () => void;
}

export default function EventsTable({
  events,
  fetchEvents,
}: EventsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-stone-200 hover:bg-transparent">
          <TableHead className="w-8"></TableHead>
          <TableHead className="font-semibold text-stone-700">Title</TableHead>
          <TableHead className="font-semibold text-stone-700">Date</TableHead>
          <TableHead className="font-semibold text-stone-700">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => {
          const isExpanded = expandedId === event._id;
          return (
            <React.Fragment key={event._id}>
              <TableRow
                className={cn(
                  "cursor-pointer transition-colors",
                  isExpanded && "bg-stone-100"
                )}
                onClick={() => toggle(event._id)}
              >
                <TableCell className="w-8 py-2">
                  {isExpanded ? (
                    <CaretDown size={16} weight="bold" className="text-stone-600" />
                  ) : (
                    <CaretRight size={16} weight="bold" className="text-stone-400" />
                  )}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {event.title}
                </TableCell>
                <TableCell className="text-stone-600">
                  {parseEventDate(event.date).toLocaleDateString("en-US")}
                </TableCell>
                <TableCell className="text-stone-600">
                  {formatTime(event.time)}
                </TableCell>
              </TableRow>
              {isExpanded && (
                <TableRow key={`${event._id}-detail`} className="bg-stone-50">
                  <TableCell colSpan={4} className="p-4">
                    <EventDetailContent
                      event={event}
                      fetchEvents={fetchEvents}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
