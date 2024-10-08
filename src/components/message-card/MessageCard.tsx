import { useState } from "react";
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

import { Phone, Mail, MessageCircle, CalendarRange, Send } from "lucide-react";

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
              <p>{message.firstName}</p>
              <p>{message.lastName}</p>
            </div>
            <div>
              <p className="flex items-center gap-3 md:gap-6">
                <Send />
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
              <div className="border-b border-black font-semibold">
                <div className="mb-3 flex w-full items-center justify-between">
                  <Mail
                    className="flex-shrink-0"
                    style={{ color: "black", width: "28px", height: "28px" }}
                  />
                  <Divider borderColor={"border-black"} />
                  <a
                    href={`mailto:${message.email}`}
                    className="cursor-pointer transition-all hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="mb-3 flex w-full items-center justify-between">
                  <Phone
                    className="flex-shrink-0"
                    style={{ color: "black", width: "28px", height: "28px" }}
                  />
                  <Divider borderColor={"border-black"} />
                  <p>{message.phone}</p>
                </div>

                <div className="mb-3 flex w-full items-center justify-between">
                  <CalendarRange
                    className="flex-shrink-0"
                    style={{ color: "black", width: "28px", height: "28px" }}
                  />
                  <Divider borderColor={"border-black"} />
                  <p>{message.preferredDate}</p>
                </div>
              </div>
              <div className="flex w-full flex-col border-b border-black pb-3">
                <div className="flex w-full items-center justify-between py-3">
                  <MessageCircle
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
                <p className="text-justify">"{message.message.trim()}"</p>
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
                        <Button
                          className=""
                          onClick={confirmDelete}
                          variant="destructive"
                        >
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
