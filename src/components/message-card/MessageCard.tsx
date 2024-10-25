import { useState, useEffect } from "react";
import { MessageCardProps } from "@/types/messages";

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
  Envelope,
  EnvelopeOpen,
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

  const formatDate = (eventDate: any) => {
    if (eventDate instanceof Date) {
      return setEventDate(eventDate.toDateString());
    }
    return setEventDate(new Date(eventDate).toDateString());
  };

  useEffect(() => {
    if (message.formType === "dj") {
      setInquiryType("~ DJ Inquiry ~");
    } else if (message.formType === "event") {
      setInquiryType("~ Event Inquiry ~");
      if (message.eventType === "meeting") {
        setEventType("~ Meeting / Workspace ~");
      } else {
        setEventType("~ Birthday / Graduation / Wedding ~");
      }
      if (message.musicType === "personal") {
        setMusicType("Personal device");
      } else if (message.musicType === "dj") {
        setMusicType("DJ");
      } else {
        setMusicType("House vinyl");
      }

      formatDate(message.eventDate);
    } else {
      setInquiryType("~ General Inquiry ~");
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

  const handleDeleteClose = () => {
    setOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch("/api/message", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: message._id,
        }),
      });

      if (response.ok) {
        fetchMessages();
        handleDeleteClose();
      }
    } catch (error) {
      console.error("Failed to delete message.");
      handleDeleteClose();
    }
  };

  return (
    <>
      <AccordionItem
        value={`Message #${index}`}
        className="border-t border-black"
      >
        <AccordionTrigger>
          <div className="flex w-full justify-between pr-3 font-bigola text-base md:pr-6 md:text-xl">
            <div className="flex gap-1 capitalize">
              <p>{message.name}</p>
            </div>
            <div>
              <p className="flex items-center gap-3 md:gap-6">
                {message.read ? (
                  <EnvelopeOpen size={32} weight="duotone" />
                ) : (
                  <Envelope size={32} weight="duotone" />
                )}
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
              <div className="border-b border-black font-hypatiaSemibold">
                <h2 className="mb-3 text-center font-bigola text-2xl">
                  {inquiryType}
                </h2>
                <div className="mb-3 flex w-full items-center justify-between text-nowrap capitalize">
                  <UserCircle size={36} weight="duotone" />
                  <Divider borderColor="grey" />
                  <p className="capitalize">{message.name}</p>
                </div>
                <div className="mb-3 flex w-full items-center justify-between">
                  <Mailbox size={36} weight="duotone" />
                  <Divider borderColor="grey" />
                  <a
                    href={`mailto:${message.email}`}
                    className="cursor-pointer transition-all hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="mb-3 flex w-full items-center justify-between">
                  <Phone size={36} weight="duotone" />
                  <Divider borderColor="grey" />
                  <p>{message.phone}</p>
                </div>
              </div>
              {message.formType === "event" && (
                <div className="text-nowrap border-b border-black py-3 font-hypatiaSemibold capitalize">
                  <h3 className="mb-3 text-center font-bigola text-xl">
                    {eventType}
                  </h3>
                  <div className="mb-3 flex w-full items-center justify-between">
                    <CalendarBlank size={36} weight="duotone" />
                    <Divider borderColor="grey" />
                    <p>{eventDate}</p>
                  </div>
                  <div className="mb-3 flex w-full items-center justify-between">
                    <Clock size={36} weight="duotone" />
                    <Divider borderColor="grey" />
                    <p>{message.eventTime}</p>
                  </div>
                  <div className="mb-3 flex w-full items-center justify-between">
                    <Users size={36} weight="duotone" />
                    <Divider borderColor="grey" />
                    <p>{message.guests} guests</p>
                  </div>
                  <div className="mb-3 flex w-full items-center justify-between">
                    <MusicNote size={32} weight="duotone" />
                    <Divider borderColor="grey" />
                    <p>{musicType}</p>
                  </div>
                </div>
              )}
              <div className="flex w-full items-center border-b border-black font-hypatia">
                <div className="flex h-full items-center justify-between py-3 pr-3">
                  <ChatCircle size={36} weight="duotone" />
                </div>
                <p className="py-3 pl-3 text-left">
                  "{message.message.trim()}"
                </p>
              </div>

              <div className="flex justify-between font-hypatia">
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
                <div className="flex flex-col justify-end font-bigola text-black">
                  <Dialog>
                    <DialogTrigger>
                      <Button>Delete</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Message</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this message? This
                          cannot be undone.
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" className="text-black">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button onClick={confirmDelete} variant="destructive">
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </>
  );
};

export default MessageCard;
