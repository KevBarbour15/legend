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
  image_url: string;
  is_photo: boolean;
  is_public: boolean;
}

interface EditEventModalProps {
  event: Event;
  fetchEvents: () => void;
  handleEditClose: () => void;
  openEdit: boolean;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
  openEdit,
  handleEditClose,
  fetchEvents,
}) => {
  const [editedEvent, setEditedEvent] = useState<Event>({ ...event });

  const handleEditChange =
    (field: keyof Event) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditedEvent({ ...editedEvent, [field]: event.target.value });
    };

  const confirmEdit = async () => {
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
    <Dialog open={openEdit} onClose={handleEditClose}>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={editedEvent.title}
          onChange={handleEditChange("title")}
          className="font-hypatia text-customNavy"
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
        <Button
          onClick={handleEditClose}
          className="font-hypatiaBold text-customNavy"
        >
          Cancel
        </Button>
        <Button
          onClick={confirmEdit}
          className="font-hypatiaBold text-customNavy"
          autoFocus
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventModal;
