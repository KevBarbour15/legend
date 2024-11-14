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

import { DeleteMessageDialogProps } from "@/data/messages";

const DeleteMessageDialog: React.FC<DeleteMessageDialogProps> = ({
  openDeleteModal,
  closeDeleteModal,
  fetchMessages,
  message,
}) => {
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
        closeDeleteModal();
        fetchMessages();
      }
    } catch (error) {
      console.error("Failed to delete message.");
    }
  };

  return (
    <Dialog open={openDeleteModal} onOpenChange={closeDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Message</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this message? This action cannot be
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

export default DeleteMessageDialog;
