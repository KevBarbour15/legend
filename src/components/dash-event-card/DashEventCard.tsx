import React from "react";
import { DashEventCardProps } from "@/data/events";
import { parseEventDate } from "@/utils/date";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EventDetailContent from "./EventDetailContent";

const DashEventCard: React.FC<DashEventCardProps> = ({
  event,
  fetchEvents,
  index,
}) => {
  return (
    <AccordionItem
      value={`Event #${index}`}
      className="border-t-2 border-black"
    >
      <AccordionTrigger>
        <div className="flex min-w-0 flex-1 items-center justify-between pr-3 text-base capitalize md:pr-6 md:text-xl">
          <p className="min-w-0 flex-1 truncate pr-6 text-left">
            {event.title}
          </p>
          <p className="flex-shrink-0">
            {parseEventDate(event.date).toLocaleDateString("en-US")}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="border-black py-3 text-black">
        <EventDetailContent event={event} fetchEvents={fetchEvents} />
      </AccordionContent>
    </AccordionItem>
  );
};

export default DashEventCard;
