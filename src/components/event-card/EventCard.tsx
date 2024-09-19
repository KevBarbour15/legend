import { formatTime } from "@/utils/time";
import React, { useRef, useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Close from "@mui/icons-material/Close";

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

interface EventCardProps {
  event: Event;
  fetchEvents: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, fetchEvents }) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    timeZone: "UTC",
  });
  const formattedTime = formatTime(event.time);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);

  const handleImageModalOpen = () => setOpenImageModal(true);
  const handleImageModalClose = () => setOpenImageModal(false);

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

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
        setOpenDelete(false);
        fetchEvents();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="flex w-90vw flex-col py-3 text-left text-customCream md:w-65vw lg:w-60vw xl:w-60vw xxl:w-60vw"
      >
        <div className="flex flex-col justify-between font-bigola md:flex-row">
          <div className="block">
            <h2 className="mb-3 text-xl text-customGold md:mb-6">
              {formattedDate}
            </h2>
            <h2 className="mb-3 font-bigola text-3xl md:mb-6 md:text-5xl">
              {event.title}
            </h2>
            <div className="mb-3 flex flex-col md:mb-0 md:flex-row">
              <h2 className="mb-3 text-xl md:mb-0 md:mr-12">{formattedTime}</h2>
              <p className="font-hypatia text-xl md:text-2xl">
                {event.description}
              </p>
            </div>
          </div>
          {event.is_photo ? (
            <Button onClick={handleImageModalOpen} className="p-0">
              <img
                src={event.image_url}
                alt="event"
                className="h-auto w-full object-cover md:h-200px md:w-200px"
              ></img>
            </Button>
          ) : (
            <Button onClick={handleImageModalOpen} className="p-0">
              <video
                src={event.image_url}
                className="aspect-square h-auto w-full object-cover object-center md:h-250px md:w-250px"
                loop
                autoPlay
                muted
                playsInline
              ></video>
            </Button>
          )}
        </div>
      </div>

      {/************************************  Delete event modal *************************************/}
      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Event?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/************************************ Edit event modal *************************************/}

      {/************************************ View event media modal *************************************/}
      <Modal open={openImageModal} onClose={handleImageModalClose}>
        <Box>
          <div className="relative flex h-screen w-screen items-center justify-center p-3">
            <IconButton
              onClick={handleImageModalClose}
              className="fixed right-3 top-3 md:right-6 md:top-6"
            >
              <Close className="text-customWhite transition-all hover:scale-125 hover:text-customCream" />
            </IconButton>
            {event.is_photo ? (
              <img
                src={event.image_url}
                alt="event"
                className="event-media aspect-square w-full object-cover object-center md:h-[75vh] md:w-auto"
              ></img>
            ) : (
              <video
                src={event.image_url}
                className="event-media aspect-square w-full object-cover object-center md:h-[75vh] md:w-auto"
                loop
                autoPlay
                muted
                playsInline
              ></video>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default EventCard;
