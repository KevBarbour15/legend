import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";

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

interface Message {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  sentAt: Date;
  howDidYouHear: string;
  budget: string;
  message: string;
  read: boolean;
  contacted: boolean;
}

interface MessageCardProps {
  message: Message;
  fetchMessages: () => void;
  index: number;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  fetchMessages,
  index,
}) => {
  const [contacted, setContacted] = useState<boolean>(message.contacted);
  const [read, setRead] = useState<boolean>(message.read);
  const [open, setOpen] = useState<boolean>(false);

  const formattedDate = new Date(message.sentAt).toLocaleDateString();
  const formattedPreferredDate = new Date(
    message.preferredDate,
  ).toLocaleDateString();

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
      // reset the switch
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
        console.log("Read status updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update read/unread status.");

      setRead(!newRead);
    }
  };

  const handleDeleteOpen = () => {
    setOpen(true);
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
        console.log("Message deleted successfully.");
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
      <Accordion type="single" collapsible className="w-full" key={index}>
        <AccordionItem value={`Message ${index}`}>
          <AccordionTrigger>
            <div className="flex w-full justify-between font-bigola text-xl">
              <div className="flex gap-1">
                <p>{message.firstName}</p>
                <p>{message.lastName}</p>
              </div>
              <p className="mr-3">
                {new Date(message.sentAt).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t border-black py-3 text-black">
            <Card className="w-full p-0">
              <CardContent className="flex w-full flex-col justify-between p-3 text-left text-lg md:flex-row">
                <div className="mb-3 mr-3 w-full md:mb-0">
                  <div className="block pb-3">
                    <p className="font-bold">Message:</p>
                    <p>{message.message}</p>
                  </div>
                  <div className="block pb-3">
                    <p className="font-bold">Preferred Date:</p>
                    <p>{message.preferredDate}</p>
                  </div>
                  <div className="block pb-3">
                    <p className="font-bold">Email:</p>
                    <a
                      href={`mailto:${message.email}`}
                      className="cursor-pointer transition-all hover:underline"
                    >
                      {message.email}
                    </a>
                  </div>
                  <div className="block">
                    <p className="font-bold">Phone:</p>
                    <p>{message.phone}</p>
                  </div>
                </div>
                <div className="flex w-full flex-row justify-between border-t border-black font-bold md:w-fit md:flex-col md:border-0">
                  <div className="mt-3 block md:mt-0">
                    <div className="mb-3 flex items-center gap-3 p-0">
                      <Switch checked={read} onCheckedChange={handleRead} />
                      <p>Read</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={contacted}
                        onCheckedChange={handleContacted}
                      />
                      <p>Contacted</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end text-black md:flex-row">
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
                            className="mb-1.5 md:mb-0"
                            onClick={confirmDelete}
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
      </Accordion>
    </>
  );
};

export default MessageCard;
