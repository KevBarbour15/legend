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
  title: string;
  date: string;
  time: string;
  description: string;
  notes: string;
}

interface EventCardProps {
  event: Event;
  inDashboard: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, inDashboard }) => {
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

  const confirmDelete = () => {
    console.log("Delete confirmed");
  };

  const handleEditOpen = () => {
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleEditChange = (field: keyof Event) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEvent({ ...editedEvent, [field]: event.target.value });
  };

  const confirmEdit = () => {
    console.log("Edit confirmed", editedEvent);
    handleEditClose();
  };

  return (
    <>
      <div className="flex flex-col w-85vw lg:w-50vw xl:w-45vw xxl:w-40vw border-y-2 border-customGold m-5 p-5 text-left">
        {inDashboard ? (
          <>
            <h1 className="font-bigola text-customCream text-3xl mb-2">
              {event.title}
            </h1>
            <p className="font-hypatia text-lg lg:text-xl">
              {event.description}
            </p>
            <p className="font-hypatia text-lg lg:text-xl mb-1">
              {formattedDate}
            </p>
            <p className="font-hypatia text-lg lg:text-xl mb-1">
              {formattedTime}
            </p>

            <div className="flex flex-row mt-2">
              <button
                className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 mr-7 tracking-wider"
                onClick={handleEditOpen}
              >
                EDIT
              </button>
              <button
                className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 tracking-wider"
                onClick={handleDeleteOpen}
              >
                DELETE
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-bigola text-customCream text-3xl mb-2">
              {event.title}
            </h1>
            <p className="font-hypatia text-base mb-1">{formattedDate}</p>
            <p className="font-hypatia text-base mb-1">{formattedTime}</p>
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
            Are you sure you want to delete this event? This action cannot be undone.
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