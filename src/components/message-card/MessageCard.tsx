import { useState } from "react";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

interface Message {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  sentAt: Date;
  howDidYouHear: string;
  budget: string;
  message: string;
  read: boolean;
  contacted: boolean;
}

interface MessageCardProps {
  message: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const [contacted, setContacted] = useState<boolean>(message.contacted);
  const [read, setRead] = useState<boolean>(message.read);
  const [open, setOpen] = useState<boolean>(false);

  const formattedDate = new Date(message.sentAt).toLocaleDateString();
  const formattedPreferredDate = new Date(
    message.preferredDate,
  ).toLocaleDateString();

  const handleContacted = async () => {
    const newContacted = !contacted;
    setContacted(newContacted);
    try {
      const response = await fetch(
        `/api/message?action=updateContactedStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: message._id,
            contacted: newContacted,
          }),
        },
      );

      if (response.ok) {
        console.log("Contacted status updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update contacted status.");
      // reset the switch
      setContacted(!newContacted);
    }
  };

  const handleRead = async () => {
    const newRead = !read;
    setRead(newRead);
    try {
      const response = await fetch(`/api/message?action=updateReadStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: message._id,
          read: newRead,
        }),
      });

      if (response.ok) {
        console.log("Read status updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update read/unread status.");
      // reset the switch
      setRead(!newRead);
    }
  };

  const handleDeleteOpen = () => {
    setOpen(true);
  };

  const handleDeleteClose = () => {
    setOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/message?action=deleteMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: message._id,
        }),
      });

      if (response.ok) {
        console.log("Message deleted successfully.");
        // You can add additional logic to remove the message from the UI here
        handleDeleteClose();
      }
    } catch (error) {
      console.error("Failed to delete message.");
      handleDeleteClose();
    }
  };

  return (
    <>
      <div className="m-5 flex w-85vw flex-col border-y-2 border-customGold p-5 text-left lg:w-50vw xl:w-45vw xxl:w-40vw">
        <h1 className="mb-2 font-bigola text-3xl text-customCream">
          {message.firstName} {message.lastName}
        </h1>
        <p className="mb-1 font-hypatia text-lg lg:text-xl">{formattedDate}</p>
        <ul className="mb-1 list-disc pl-5 font-hypatia text-lg lg:text-xl">
          <li>Email:</li>
          <p className="mb-1 font-hypatia text-lg lg:text-xl">
            <a href={`mailto:${message.email}`} className="underline">
              {message.email}
            </a>
          </p>
          <li>Phone:</li>
          <p>{message.phone}</p>
          <li className="m-0">Preferred date: </li>
          <p>{formattedPreferredDate}</p>
          <li>How did you hear?</li>
          <p>{message.howDidYouHear}</p>
          <li>Budget:</li>
          <p>Budget: {message.budget}</p>
          <li>Message:</li>
          <p>"{message.message}"</p>
        </ul>
        <FormGroup>
          <FormControlLabel
            style={{ color: "#dfcfc0" }}
            label="Contacted"
            onChange={handleContacted}
            checked={contacted}
            control={<Switch />}
          />
          <FormControlLabel
            style={{ color: "#dfcfc0" }}
            label="Read"
            onChange={handleRead}
            checked={read}
            control={<Switch />}
          />
        </FormGroup>
        <div className="mt-2 flex flex-row">
          <button
            className="rounded-full bg-customGold px-14 py-3.5 font-hypatia font-bold tracking-wider"
            onClick={handleDeleteOpen}
          >
            DELETE
          </button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Message?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this message? This action cannot be
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
    </>
  );
};

export default MessageCard;
