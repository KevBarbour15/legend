"use client";

import { useState } from "react";
import { Event } from "@/data/events";
import { formatTime } from "@/utils/time";
import { parseEventDate } from "@/utils/date";
import {
  DetailCard,
  DetailSection,
  DetailField,
  DetailActions,
  DetailBody,
} from "@/components/dashboard-detail/DetailCard";
import { Button } from "@/components/ui/button";
import EditEventModal from "@/components/edit-event-modal/EditEventModal";
import DeleteEventModal from "@/components/delete-event-modal/DeleteEventModal";

interface EventDetailContentProps {
  event: Event;
  fetchEvents: () => void;
}

export default function EventDetailContent({
  event,
  fetchEvents,
}: EventDetailContentProps) {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

  return (
    <>
      <DetailCard className="flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="min-w-0 flex-1">
          <DetailSection>
            <h2 className="mb-2 text-lg font-semibold capitalize text-stone-900">
              {event.title}
            </h2>
            <DetailField
              label="Date"
              value={parseEventDate(event.date).toLocaleDateString("en-US")}
            />
            <DetailField label="Time" value={formatTime(event.time)} />
          </DetailSection>

          <DetailSection title="Description">
            <DetailBody>{event.description}</DetailBody>
          </DetailSection>

          <DetailActions>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingEvent(event)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                onClick={() => setDeletingEvent(event)}
              >
                Delete
              </Button>
            </div>
          </DetailActions>
        </div>

        <div className="flex-shrink-0 md:w-48 lg:w-56">
          {event.is_photo ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="rounded-md border border-stone-200 object-cover object-center"
            />
          ) : (
            <video
              src={event.image_url}
              className="aspect-square w-full rounded-md border border-stone-200 object-cover object-center"
              loop
              autoPlay
              muted
              playsInline
            />
          )}
        </div>
      </DetailCard>

      {editingEvent && (
        <EditEventModal
          closeEditModal={() => setEditingEvent(null)}
          fetchEvents={fetchEvents}
          openEditModal={true}
          event={editingEvent}
        />
      )}
      {deletingEvent && (
        <DeleteEventModal
          fetchEvents={fetchEvents}
          openDeleteModal={true}
          closeDeleteModal={() => {
            setDeletingEvent(null);
            fetchEvents();
          }}
          event={deletingEvent}
        />
      )}
    </>
  );
}
