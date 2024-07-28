import { formatTime } from "@/utils/time";
import { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
}

interface EventCardProps {
  event: Event;
  inDashboard: boolean;
  fetchEvents: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  inDashboard,
  fetchEvents,
}) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event>({ ...event });
  const formattedDate = new Date(event.date).toLocaleDateString();
  const formattedTime = formatTime(event.time);

  const handleDeleteOpen = () => {
    setOpenDelete(true);
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  const confirmDelete = async () => {
    console.log("event: ", event._id);
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
      const response = await fetch(`/api/events?action=${"editEvent"}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event: editedEvent }),
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
      <div className="m-5 flex w-85vw flex-col border-y-2 border-customGold p-5 text-left lg:w-50vw xl:w-45vw xxl:w-40vw">
        {inDashboard ? (
          <>
            <h1 className="mb-2 font-bigola text-3xl text-customCream">
              {event.title}
            </h1>
            <p className="font-hypatia text-lg lg:text-xl">
              {event.description}
            </p>
            <p className="mb-1 font-hypatia text-lg lg:text-xl">
              {formattedDate}
            </p>
            <p className="mb-1 font-hypatia text-lg lg:text-xl">
              {formattedTime}
            </p>

            <div className="mt-2 flex flex-row">
              <button
                className="mr-7 rounded-full bg-customGold px-14 py-3.5 font-hypatia font-bold tracking-wider"
                onClick={handleEditOpen}
              >
                EDIT
              </button>
              <button
                className="rounded-full bg-customGold px-14 py-3.5 font-hypatia font-bold tracking-wider"
                onClick={handleDeleteOpen}
              >
                DELETE
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-2 font-bigola text-3xl text-customCream">
              {event.title}
            </h1>
            <p className="mb-1 font-hypatia text-base">{formattedDate}</p>
            <p className="mb-1 font-hypatia text-base">{formattedTime}</p>
            <p className="font-hypatia text-base">{event.description}</p>
          </>
        )}
      </div>
      {/* Delete event */}
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
        <DialogTitle id="edit-dialog-title">{"Edit Event"}</DialogTitle>
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
            label="Description"
            type="text"
            fullWidth
            value={editedEvent.description}
            onChange={handleEditChange("description")}
          />
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
