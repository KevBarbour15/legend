"use client";

import { useState, useEffect } from "react";
import { Message } from "@/data/messages";
import {
  DetailCard,
  DetailSection,
  DetailField,
  DetailActions,
  DetailBody,
} from "@/components/dashboard-detail/DetailCard";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { musicTypes, eventTypes } from "@/data/forms";
import DeleteMessageDialog from "@/components/delete-message-modal/DeleteMessageModal";

interface MessageDetailContentProps {
  message: Message;
  fetchMessages: () => void;
}

export function getMessageTypeLabel(formType: string): string {
  if (formType === "dj") return "DJ Inquiry";
  if (formType === "event") return "Event Inquiry";
  return "General Inquiry";
}

export default function MessageDetailContent({
  message,
  fetchMessages,
}: MessageDetailContentProps) {
  const [contacted, setContacted] = useState<boolean>(message.contacted);
  const [read, setRead] = useState<boolean>(message.read);
  const [inquiryType, setInquiryType] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [musicType, setMusicType] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (message.formType === "dj") {
      setInquiryType("DJ Inquiry");
    } else if (message.formType === "event") {
      setInquiryType("Event Inquiry");
      setEventType(
        message.eventType === "meeting" ? eventTypes.meeting : eventTypes.birthday
      );
      setMusicType(
        message.musicType === "personal"
          ? musicTypes.personal
          : message.musicType === "dj"
            ? musicTypes.dj
            : musicTypes.house
      );
      setEventDate(
        message.eventDate
          ? new Date(message.eventDate).toDateString()
          : ""
      );
    } else {
      setInquiryType("General Inquiry");
    }
  }, [message]);

  const handleContacted = async () => {
    const newContacted = !contacted;
    setContacted(newContacted);
    try {
      const res = await fetch(`/api/message?action=updateContactedStatus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: message._id, contacted: newContacted }),
      });
      if (!res.ok) setContacted(!newContacted);
    } catch {
      setContacted(!newContacted);
    }
  };

  const handleRead = async () => {
    const newRead = !read;
    setRead(newRead);
    try {
      const res = await fetch(`/api/message?action=updateReadStatus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: message._id, read: newRead }),
      });
      if (res.ok) fetchMessages();
      else setRead(!newRead);
    } catch {
      setRead(!newRead);
    }
  };

  return (
    <>
      <DetailCard>
        <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-stone-500">
          {inquiryType}
        </p>

        <DetailSection title="Contact">
          {message.name && (
            <DetailField label="Name" value={message.name} />
          )}
          {message.email && (
            <DetailField
              label="Email"
              value={message.email}
              href={`mailto:${message.email}`}
            />
          )}
          {message.phone && (
            <DetailField label="Phone" value={message.phone} />
          )}
        </DetailSection>

        {message.formType === "event" && (
          <DetailSection title="Event details">
            <DetailField label="Type" value={eventType} />
            <DetailField label="Date" value={eventDate} />
            {message.eventTime && (
              <DetailField label="Time" value={message.eventTime} />
            )}
            {message.guests != null && (
              <DetailField label="Guests" value={`${message.guests}`} />
            )}
            {musicType && (
              <DetailField label="Music" value={musicType} />
            )}
          </DetailSection>
        )}

        <DetailSection title="Message">
          <DetailBody>&quot;{message.message.trim()}&quot;</DetailBody>
        </DetailSection>

        <DetailActions>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={read} onCheckedChange={handleRead} />
              <span className="text-stone-600">Read</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={contacted}
                onCheckedChange={handleContacted}
              />
              <span className="text-stone-600">Contacted</span>
            </label>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeletingMessage(message)}
          >
            Delete
          </Button>
        </DetailActions>
      </DetailCard>
      {deletingMessage && (
        <DeleteMessageDialog
          fetchMessages={fetchMessages}
          openDeleteModal={true}
          closeDeleteModal={() => setDeletingMessage(null)}
          message={deletingMessage}
        />
      )}
    </>
  );
}
