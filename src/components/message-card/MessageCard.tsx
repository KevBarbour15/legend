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
  fetchMessages: () => void;
  //calculateUnreadMessages: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  fetchMessages,
  //calculateUnreadMessages,
}) => {
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
          method: "PUT",
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
        method: "PUT",
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
        //calculateUnreadMessages();
      }
    } catch (error) {
      console.error("Failed to update read/unread status.");
      // reset the switch
      setRead(!newRead);
      //calculateUnreadMessages();
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
        console.log("Message deleted successfully.");
        fetchMessages();
        handleDeleteClose();
      }
    } catch (error) {
      console.error("Failed to delete message.");
      handleDeleteClose();
    }
  };

  return (
    <>
      <div className="w-100vw flex flex-col border-b border-customGold p-5 text-left md:w-65vw lg:w-50vw xl:w-45vw xxl:w-40vw">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="mb-2 mr-5 font-bigola text-3xl text-customWhite">
              {message.firstName} {message.lastName}
            </h1>

            <p className="mb-1 font-hypatia text-lg lg:text-xl">
              {formattedDate}
            </p>
          </div>
          <div>
            <FormGroup>
              <FormControlLabel
                label="Contacted"
                className="form-label"
                onChange={handleContacted}
                checked={contacted}
                control={<Switch />}
              />
              <FormControlLabel
                label="Read"
                className="form-label"
                onChange={handleRead}
                checked={read}
                control={<Switch />}
              />
            </FormGroup>
          </div>
        </div>
        <ul className="list-disc pl-5 text-lg lg:text-xl">
          <li className="font-bigola text-customCream">
            Email:{" "}
            <span className="font-hypatia text-customWhite">
              {message.email}
            </span>
          </li>

          <li className="font-bigola text-customCream">
            Phone:{" "}
            <span className="font-hypatia text-customWhite">
              {message.phone}
            </span>
          </li>

          <li className="font-bigola text-customCream">
            Preferred date{" "}
            <span className="font-hypatia text-customWhite">
              {formattedDate}
            </span>
          </li>

          <li className="font-bigola text-customCream">
            How did you hear?{" "}
            <span className="font-hypatia text-customWhite">
              {message.howDidYouHear}
            </span>
          </li>
          <li className="font-bigola text-customCream">
            Budget:{" "}
            <span className="font-hypatia text-customWhite">
              {message.budget}
            </span>
          </li>

          <li className="font-bigola text-customCream">
            Message:{" "}
            <span className="font-hypatia text-customWhite">
              {message.message}
            </span>
          </li>
        </ul>
        <div className="mt-2 flex flex-row justify-center">
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
