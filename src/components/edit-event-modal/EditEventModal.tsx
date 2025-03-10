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
import { Switch } from "@/components/ui/switch";

import { Event, EditEventModalProps } from "@/data/events";

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

  const handleSwitchChange = (checked: boolean) => {
    setEditedEvent({ ...editedEvent, is_photo: checked });
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-4 items-center gap-3 md:gap-6">
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
            <div className="grid grid-cols-4 items-center gap-6">
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
            <div className="grid grid-cols-4 items-center gap-6">
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
            <div className="grid grid-cols-4 items-center gap-6">
              <Label className="text-right">Media Type</Label>
              <div className="col-span-3 flex items-center gap-3">
                <span>Video</span>
                <Switch
                  checked={editedEvent.is_photo}
                  onCheckedChange={handleSwitchChange}
                />
                <span>Photo</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-6">
              <Label htmlFor="image_url" className="text-right">
                Media URL
              </Label>
              <Input
                id="image_url"
                value={editedEvent.image_url}
                onChange={handleEditChange("image_url")}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-6">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={editedEvent.description}
                onChange={handleEditChange("description")}
                className="col-span-3 h-32 resize-none"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-6">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={editedEvent.notes}
                onChange={handleEditChange("notes")}
                className="col-span-3 h-32 resize-none"
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
