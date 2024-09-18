import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

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
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  fetchMessages,
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: message._id, contacted: newContacted }),
        },
      );

      if (response.ok) {
        console.log("Contacted status updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update contacted status.");
      setContacted(!newContacted);
    }
  };

  const handleRead = async () => {
    const newRead = !read;
    setRead(newRead);
    try {
      const response = await fetch(`/api/message?action=updateReadStatus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: message._id, read: newRead }),
      });

      if (response.ok) {
        console.log("Read status updated successfully.");
      }
    } catch (error) {
      setRead(!newRead);
    }
  };

  const handleDeleteOpen = () => setOpen(true);
  const handleDeleteClose = () => setOpen(false);

  const confirmDelete = async () => {
    try {
      const response = await fetch("/api/message", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: message._id }),
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
      <Card className="w-full bg-gradient-to-r from-customWhite via-customCream p-3 backdrop-blur-sm">
        <CardContent>
          <Typography className="mb-1 p-0 font-bigola text-2xl capitalize text-customNavy">
            {message.firstName} {message.lastName}
          </Typography>
          <Typography className="mb-1 p-0 font-bigola text-xl text-customNavy">
            {formattedDate}
          </Typography>
          <FormGroup className="font-hypatia text-customNavy">
            <FormControlLabel
              control={
                <Switch checked={contacted} onChange={handleContacted} />
              }
              label="Contacted"
            />
            <FormControlLabel
              control={<Switch checked={read} onChange={handleRead} />}
              label="Read"
            />
          </FormGroup>
          <List>
            <ListItem className="p-0">
              <ListItemText primary="Email:" secondary={message.email} />
            </ListItem>
            <ListItem className="p-0">
              <ListItemText primary="Phone:" secondary={message.phone} />
            </ListItem>
            <ListItem className="p-0">
              <ListItemText
                primary="Preferred date:"
                secondary={formattedPreferredDate}
              />
            </ListItem>
            <ListItem className="p-0">
              <ListItemText primary="Message:" secondary={message.message} />
            </ListItem>
          </List>
        </CardContent>
        <CardActions>
          <Button
            onClick={handleDeleteOpen}
            className="w-fit rounded-full px-12 py-3 font-bigola text-lg text-customNavy transition-colors duration-300"
          >
            Delete message
          </Button>
        </CardActions>
      </Card>

      <Dialog
        open={open}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Message?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this message? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button onClick={confirmDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MessageCard;
