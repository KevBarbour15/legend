import { useState, useEffect } from "react";
import { MessageCardProps } from "@/data/messages";

import Divider from "../divider/Divider";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";

import {
  ChatCircle,
  Phone,
  Mailbox,
  CalendarBlank,
  Clock,
  Users,
  UserCircle,
  MusicNote,
} from "@phosphor-icons/react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { musicTypes, eventTypes } from "@/data/forms";
import DeleteMessageDialog from "../delete-message-modal/DeleteMessageModal";

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  fetchMessages,
  index,
}) => {
  const [contacted, setContacted] = useState<boolean>(message.contacted);
  const [read, setRead] = useState<boolean>(message.read);
  const [open, setOpen] = useState<boolean>(false);
  const [inquiryType, setInquiryType] = useState<string>("");
  const [eventType, setEventType] = useState<string>("");
  const [musicType, setMusicType] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [deletingMessage, setDeletingMessage] = useState<typeof message | null>(
    null,
  );

  const formatDate = (eventDate: any) => {
    if (eventDate instanceof Date) {
      return setEventDate(eventDate.toDateString());
    }
    return setEventDate(new Date(eventDate).toDateString());
  };

  useEffect(() => {
    if (message.formType === "dj") {
      setInquiryType("DJ Inquiry");
    } else if (message.formType === "event") {
      setInquiryType("Event Inquiry");
      if (message.eventType === "meeting") {
        setEventType(eventTypes.meeting);
      } else {
        setEventType(eventTypes.birthday);
      }
      if (message.musicType === "personal") {
        setMusicType(musicTypes.personal);
      } else if (message.musicType === "dj") {
        setMusicType(musicTypes.dj);
      } else {
        setMusicType(musicTypes.house);
      }

      formatDate(message.eventDate);
    } else {
      setInquiryType("General Inquiry");
    }
  }, []);

  const handleContacted = async () => {
    const newContacted = !contacted;
    setContacted(newContacted);
    try {
      const response = await fetch(
        `/api/message?action=updateContactedStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: message._id,
            contacted: newContacted,
          }),
        },
      );

      if (response.ok) {
        console.log("Contacted status updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update contacted status.");
      setContacted(!newContacted);
    }
  };

  const handleRead = async () => {
    const newRead = !read;
    setRead(newRead);

    try {
      const response = await fetch(`/api/message?action=updateReadStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: message._id,
          read: newRead,
        }),
      });

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to update read/unread status.");

      setRead(!newRead);
    }
  };

  const openDeleteModal = (message: any) => {
    setDeletingMessage(message);
  };

  const closeDeleteModal = () => {
    setDeletingMessage(null);
  };

  return (
    <>
      <AccordionItem
        value={`Message #${index}`}
        className="border-t-2 border-black"
      >
        <AccordionTrigger>
          <div className="flex w-full justify-between text-nowrap pr-3 text-base font-semibold capitalize md:pr-6 md:text-xl">
            <div className="flex gap-1">
              <p>{message.name}</p>
            </div>
            <Divider borderColor="grey" />
            <div>
              <p className="flex items-center gap-3 md:gap-6">
                {new Date(message.sentAt).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-black py-3">
          <Card className="p-3 md:p-6">
            <CardContent className="text-base md:text-lg">
              <div className="text-nowrap border-b-2 border-black">
                <h2 className="mb-3 text-center text-2xl font-semibold">
                  {inquiryType}
                </h2>
                {message.name && (
                  <div className="mb-3 flex w-full items-center justify-between capitalize">
                    <UserCircle
                      size={32}
                      weight="regular"
                      className="flex-shrink-0"
                    />
                    <Divider borderColor="grey" />
                    <p className="capitalize">{message.name}</p>
                  </div>
                )}
                {message.email && (
                  <div className="mb-3 inline-flex w-full items-center justify-between">
                    <Mailbox
                      size={32}
                      weight="regular"
                      className="flex-shrink-0"
                    />
                    <Divider borderColor="grey" />
                    <a
                      href={`mailto:${message.email}`}
                      className="cursor-pointer transition-all hover:underline"
                    >
                      {message.email}
                    </a>
                  </div>
                )}
                {message.phone && (
                  <div className="mb-3 flex w-full items-center justify-between">
                    <Phone
                      size={32}
                      weight="regular"
                      className="flex-shrink-0"
                    />
                    <Divider borderColor="grey" />
                    <p>{message.phone}</p>
                  </div>
                )}
              </div>
              {message.formType === "event" && (
                <div className="text-nowrap border-b-2 border-black py-3 capitalize">
                  <h3 className="mb-3 text-center text-xl font-semibold">
                    {eventType}
                  </h3>
                  <div className="mb-3 flex w-full items-center justify-between">
                    <CalendarBlank
                      size={32}
                      weight="regular"
                      className="flex-shrink-0"
                    />
                    <Divider borderColor="grey" />
                    <p>{eventDate}</p>
                  </div>
                  {message.eventTime && (
                    <div className="mb-3 flex w-full items-center justify-between">
                      <Clock
                        size={32}
                        weight="regular"
                        className="flex-shrink-0"
                      />
                      <Divider borderColor="grey" />
                      <p>{message.eventTime}</p>
                    </div>
                  )}
                  {message.guests && (
                    <div className="mb-3 flex w-full items-center justify-between">
                      <Users
                        size={32}
                        weight="regular"
                        className="flex-shrink-0"
                      />
                      <Divider borderColor="grey" />
                      <p>{message.guests} guests</p>
                    </div>
                  )}
                  {musicType && (
                    <div className="mb-3 flex w-full items-center justify-between">
                      <MusicNote
                        size={32}
                        weight="regular"
                        className="flex-shrink-0"
                      />
                      <Divider borderColor="grey" />
                      <p>{musicType}</p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex w-full items-center border-b-2 border-black py-3">
                <div className="flex h-full items-center justify-between pr-3">
                  <ChatCircle
                    size={32}
                    weight="regular"
                    className="flex-shrink-0"
                  />
                </div>
                <div className="w-full">
                  <p className="text-pretty text-center">
                    "{message.message.trim()}"
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="block pt-3 md:mt-0">
                  <div className="flex items-center justify-start gap-3 pb-3 md:gap-6">
                    <Switch checked={read} onCheckedChange={handleRead} />
                    <p>Read</p>
                  </div>
                  <div className="flex items-center justify-start gap-3 md:gap-6">
                    <Switch
                      checked={contacted}
                      onCheckedChange={handleContacted}
                    />
                    <p>Contacted</p>
                  </div>
                </div>
                <div className="flex flex-col justify-end text-black">
                  <Button
                    variant="destructive"
                    onClick={() => openDeleteModal(message)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
      {deletingMessage && (
        <DeleteMessageDialog
          fetchMessages={fetchMessages}
          openDeleteModal={true}
          closeDeleteModal={closeDeleteModal}
          message={deletingMessage}
        />
      )}
    </>
  );
};

export default MessageCard;
