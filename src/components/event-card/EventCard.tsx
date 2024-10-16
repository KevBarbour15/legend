import React, { useRef, useState } from "react";

import { EventCardProps } from "@/types/events";

import { formatTime } from "@/utils/time";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Close from "@mui/icons-material/Close";

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    timeZone: "UTC",
  });
  const formattedTime = formatTime(event.time);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);

  const handleImageModalOpen = () => setOpenImageModal(true);
  const handleImageModalClose = () => setOpenImageModal(false);

  return (
    <>
      <div
        ref={containerRef}
        className="flex w-full flex-col py-3 text-left text-customCream"
      >
        <div className="flex flex-col font-bigola md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3 pb-3 md:flex-grow md:pb-0 md:pr-6">
            <h2 className="text-xl text-customGold md:text-2xl">
              {formattedDate}
            </h2>
            <h2 className="text-3xl md:text-5xl">{event.title}</h2>
            <h2 className="text-xl md:text-xl">{formattedTime}</h2>
            <p className="font-hypatia text-xl md:text-xl">
              {event.description}
            </p>
          </div>

          <div className="my-auto md:flex-shrink-0">
            <Button
              onClick={handleImageModalOpen}
              className="w-full p-0 md:w-auto"
            >
              {event.is_photo ? (
                <div className="aspect-square w-full md:h-[225px] md:w-[225px] lg:h-[300px] lg:w-[300px]">
                  <img
                    src={event.image_url}
                    alt="event"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full md:h-[225px] md:w-[225px] lg:h-[300px] lg:w-[300px]">
                  <video
                    src={event.image_url}
                    className="h-full w-full object-cover object-center"
                    loop
                    autoPlay
                    muted
                    playsInline
                  />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/************************************ View event media modal *************************************/}
      <Modal open={openImageModal} onClose={handleImageModalClose}>
        <Box>
          <div className="relative flex h-screen w-screen items-center justify-center p-3">
            <IconButton
              onClick={handleImageModalClose}
              className="fixed right-3 top-3 md:right-6 md:top-6"
            >
              <Close className="text-customWhite transition-all hover:text-customCream" />
            </IconButton>
            {event.is_photo ? (
              <img
                src={event.image_url}
                alt="event"
                className="event-media aspect-square w-full object-cover object-center md:h-[50vh] md:w-auto"
              ></img>
            ) : (
              <video
                src={event.image_url}
                className="event-media aspect-square w-full object-cover object-center md:h-[50vh] md:w-auto"
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
