import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteEventDialogProps {
  openDeleteModal: boolean;
  fetchEvents: () => void;
  closeDeleteModal: () => void;
  event: Event;
}

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

const DeleteEventDialog: React.FC<DeleteEventDialogProps> = ({
  openDeleteModal,
  closeDeleteModal,
  fetchEvents,
  event,
}) => {
  const confirmDelete = async () => {
    try {
      const response = await fetch("/api/events", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: event._id }),
      });

      if (response.ok) {
        closeDeleteModal();
        fetchEvents();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  return (
    <Dialog open={openDeleteModal} onOpenChange={closeDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="text-black"
            onClick={closeDeleteModal}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEventDialog;
