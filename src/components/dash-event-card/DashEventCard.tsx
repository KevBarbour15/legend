import React, { useState } from "react";

import { DashEventCardProps, Event } from "@/data/events";

import { formatTime } from "@/utils/time";
import { parseEventDate } from "@/utils/date";

import EditEventModal from "../edit-event-modal/EditEventModal";
import DeleteEventModal from "../delete-event-modal/DeleteEventModal";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Divider from "../divider/Divider";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Clock, Info } from "lucide-react";

const DashEventCard: React.FC<DashEventCardProps> = ({
  event,
  fetchEvents,
  index,
}) => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
  };

  const closeEditModal = () => {
    setEditingEvent(null);
  };

  const openDeleteModal = (event: Event) => {
    setDeletingEvent(event);
  };

  const closeDeleteModal = () => {
    setDeletingEvent(null);
    fetchEvents();
  };
  return (
    <>
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
          <Card className="flex flex-col-reverse gap-3 p-3 md:flex-row md:justify-between md:gap-0 md:p-6">
            <div className="flex w-full flex-col">
              <h2 className="mx-auto w-full text-wrap text-center text-2xl font-semibold capitalize">
                {event.title}
              </h2>
              <div className="flex w-full items-center justify-between border-b-2 border-black py-3">
                <Clock
                  className="flex-shrink-0"
                  style={{ color: "black", width: "28px", height: "28px" }}
                />
                <Divider borderColor={"grey"} />
                <p className="text-nowrap font-semibold">
                  {formatTime(event.time)}
                </p>
              </div>
              <div className="flex w-full border-b-2 border-black py-3">
                <div className="flex h-full pr-3">
                  <Info
                    className="flex-shrink-0"
                    style={{ color: "black", width: "28px", height: "28px" }}
                  />
                </div>
                <p className="whitespace-pre-wrap text-pretty">
                  {event.description}
                </p>
              </div>

              <div className="flex h-full w-full items-end pt-3">
                <Button
                  className="mr-3"
                  onClick={() => openEditModal(event)}
                  variant="outline"
                >
                  Edit
                </Button>
                <Button className="" onClick={() => openDeleteModal(event)}>
                  Delete
                </Button>
              </div>
            </div>
            <div className="my-auto h-full w-full p-0 sm:flex-shrink-0 md:ml-6 md:mt-auto md:w-[175px] lg:w-[225px]">
              {event.is_photo ? (
                <img
                  src={event.image_url}
                  alt="event"
                  className="h-auto w-full border-2 border-black object-cover object-center"
                />
              ) : (
                <video
                  src={event.image_url}
                  className="aspect-square h-auto w-full border-2 border-black object-cover object-center"
                  loop
                  autoPlay
                  muted
                  playsInline
                />
              )}
            </div>
          </Card>
        </AccordionContent>
      </AccordionItem>
      {editingEvent && (
        <EditEventModal
          closeEditModal={closeEditModal}
          fetchEvents={fetchEvents}
          openEditModal={true}
          event={editingEvent}
        />
      )}
      {deletingEvent && (
        <DeleteEventModal
          fetchEvents={fetchEvents}
          openDeleteModal={true}
          closeDeleteModal={closeDeleteModal}
          event={deletingEvent}
        />
      )}
    </>
  );
};

export default DashEventCard;
