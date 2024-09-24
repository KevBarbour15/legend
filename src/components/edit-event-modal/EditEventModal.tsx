import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
  image_url: string;
  is_photo: boolean;
  is_public: boolean;
}

interface EditEventModalProps {
  event: Event;
  fetchEvents: () => void;
  closeEditModal: () => void;
  openEditModal: boolean;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
  fetchEvents,
  closeEditModal,
  openEditModal,
}) => {
  const [editedEvent, setEditedEvent] = useState<Event>({ ...event });

  const handleEditChange =
    (field: keyof Event) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditedEvent({ ...editedEvent, [field]: e.target.value });
    };

  const confirmEdit = async () => {
    try {
      const response = await fetch(`/api/events?action=EditCalendar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...editedEvent }),
      });

      if (response.ok) {
        fetchEvents();
        closeEditModal();
      }
    } catch (error) {
      console.error("Error editing event: ", error);
    }
    closeEditModal();
  };

  return (
    <>
      <Dialog open={openEditModal} onOpenChange={closeEditModal}>
        <DialogContent className="w-full text-black">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={editedEvent.title}
                onChange={handleEditChange("title")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={editedEvent.date}
                onChange={handleEditChange("date")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={editedEvent.time}
                onChange={handleEditChange("time")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                Image URL
              </Label>
              <Input
                id="image_url"
                value={editedEvent.image_url}
                onChange={handleEditChange("image_url")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editedEvent.description}
                onChange={handleEditChange("description")}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={editedEvent.notes}
                onChange={handleEditChange("notes")}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditEventModal;
