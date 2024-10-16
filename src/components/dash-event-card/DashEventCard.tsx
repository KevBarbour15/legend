import React, { useState } from "react";

import { DashEventCardProps, Event } from "@/types/events";

import { formatTime } from "@/utils/time";

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
        className="border-t border-black"
      >
        <AccordionTrigger>
          <div className="flex w-full items-center justify-between text-balance pr-3 text-left font-bigola text-base md:pr-6 md:text-xl">
            <p>{event.title}</p>
            <p>
              {new Date(event.date).toLocaleDateString("en-US", {
                timeZone: "UTC",
              })}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-black py-3 text-black">
          <Card className="flex flex-col p-3 md:flex-row md:justify-between md:p-6">
            <div className="flex w-full flex-col">
              <div className="flex w-full items-center justify-between border-b border-black pb-3">
                <Clock
                  className="flex-shrink-0"
                  style={{ color: "black", width: "28px", height: "28px" }}
                />
                <Divider borderColor={"border-black"} />
                <p className="text-nowrap font-semibold">
                  {formatTime(event.time)}
                </p>
              </div>
              <div className="flex w-full flex-col border-b border-black pb-3">
                <div className="flex w-full items-center justify-between py-3">
                  <Info
                    className="flex-shrink-0"
                    style={{ color: "black", width: "28px", height: "28px" }}
                  />
                  <Divider borderColor={"border-black"} />
                  <img
                    className="h-8 w-8"
                    src="./images/monogram.png"
                    alt="Small Logo"
                  />
                </div>
                <p className="text-justify">{event.description}</p>
              </div>

              <div className="flex h-full w-full items-end py-6 md:pb-0">
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
            <div className="my-auto aspect-square w-full p-0 sm:flex-shrink-0 md:ml-6 md:mt-auto md:h-[175px] md:w-[175px] lg:h-[225px] lg:w-[225px]">
              {event.is_photo ? (
                <img
                  src={event.image_url}
                  alt="event"
                  className="aspect-square h-auto w-full border border-black object-cover object-center"
                />
              ) : (
                <video
                  src={event.image_url}
                  className="aspect-square h-auto w-full border border-black object-cover object-center"
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
