import { formatTime } from "@/utils/time";
import { use, useRef, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

// gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
  inDashboard: boolean;
  fetchEvents: () => void;
  length: number;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  inDashboard,
  fetchEvents,
  length,
  index,
}) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event>({ ...event });
  const formattedDate = new Date(event.date).toLocaleDateString();
  const formattedTime = formatTime(event.time);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
        // close the dialog and fetch the updated events
        setOpenDelete(false);
        fetchEvents();
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleEditChange =
    (field: keyof Event) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditedEvent({ ...editedEvent, [field]: event.target.value });
    };

  const confirmEdit = async () => {
    console.log("Edit confirmed", editedEvent);
    try {
      const response = await fetch(`/api/events?action=${"EditCalendar"}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...editedEvent }),
      });

      if (response.ok) {
        fetchEvents();
        handleEditClose();
      }
    } catch (error) {}
    handleEditClose();
  };

  return (
    <>
      {inDashboard ? (
        <>
          <div
            ref={containerRef}
            className={
              "flex w-90vw flex-col p-6 py-6 text-left text-customCream md:w-65vw lg:w-60vw xl:w-60vw xxl:w-60vw"
            }
          >
            <div className="flex w-full flex-col">
              <div className="mb-5 flex max-h-full max-w-full flex-row justify-between text-left font-bigola text-xl md:text-2xl">
                <h1>{formattedDate}</h1>
                <h1>{formattedTime}</h1>
              </div>
              <div className="flex flex-col justify-between md:flex-row">
                <div className="flex max-h-full flex-col gap-5 pb-5">
                  <h1 className="font-bigola text-3xl md:text-5xl">
                    {event.title}
                  </h1>
                  <p className="font-hypatia text-xl md:w-3/5 md:text-2xl">
                    {event.description}
                  </p>
                </div>
                <img
                  src={event.image_url}
                  alt="event"
                  className="h-350px w-350px object-cover md:h-200px md:w-200px"
                ></img>
              </div>
            </div>

            <div className="mt-5 flex flex-row justify-center">
              <button
                className="mr-6 py-3"
                type="submit"
                onClick={handleEditOpen}
              >
                <span className="font-bigola text-2xl leading-none text-customWhite">
                  EDIT
                </span>
              </button>
              <button className="py-3" type="submit" onClick={handleDeleteOpen}>
                <span className="font-bigola text-2xl leading-none text-customWhite">
                  DELETE
                </span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            ref={containerRef}
            className="flex w-90vw flex-col p-6 py-6 text-left text-customCream md:w-65vw lg:w-60vw xl:w-60vw xxl:w-60vw"
          >
            <div className="flex w-full flex-col">
              <div className="mb-5 flex max-h-full max-w-full flex-row justify-between text-left font-bigola text-xl md:text-2xl">
                <h1 className="drop-shadow-text">{formattedDate}</h1>
                <h1 className="drop-shadow-text">{formattedTime}</h1>
              </div>
              <div className="flex flex-col justify-between md:flex-row">
                <div className="flex max-h-full flex-col gap-5 pb-5">
                  <h1 className="font-bigola text-3xl drop-shadow-text md:text-5xl">
                    {event.title}
                  </h1>
                  <p className="font-hypatia text-xl drop-shadow-text md:w-3/5 md:text-2xl">
                    {event.description}
                  </p>
                </div>
                <img
                  src={event.image_url}
                  alt="event"
                  className="h-350px w-350px object-cover drop-shadow-text md:h-200px md:w-200px"
                ></img>
              </div>
            </div>
          </div>
        </>
      )}

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
      {/* Edit event */}
      <Dialog
        open={openEdit}
        onClose={handleEditClose}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
      >
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={editedEvent.title}
            onChange={handleEditChange("title")}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={editedEvent.date}
            onChange={handleEditChange("date")}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            value={editedEvent.time}
            onChange={handleEditChange("time")}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Image URL"
            type="text"
            fullWidth
            value={editedEvent.image_url}
            onChange={handleEditChange("image_url")}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={editedEvent.description}
            onChange={handleEditChange("description")}
          />
          {/*
          <FormGroup>
            <FormControlLabel
              label="Contacted"
              className="form-label"
              checked={editedEvent.isPublic}
              control={<Switch />}
            />
          </FormGroup>
          */}
          <TextField
            margin="dense"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editedEvent.notes}
            onChange={handleEditChange("notes")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmEdit} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventCard;
