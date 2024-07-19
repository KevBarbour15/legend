import { useState } from "react";
import { formatTime } from "@/utils/time";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

interface Message {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  number: string;
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

  const formattedDate = new Date(message.sentAt).toLocaleDateString();
  const formattedPreferredDate = new Date(
    message.preferredDate
  ).toLocaleDateString();

  const deleteMessage = async () => {
    alert("delete");
  };

  const handleContacted = async () => {
    const newContacted = !contacted;
    setContacted(newContacted);
    try {
      const response = await fetch(
        `/api/message?action=${"updateContactedStatus"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: message._id,
            contacted: newContacted,
          }),
        }
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
      const response = await fetch(
        `/api/message?action=${"updateReadStatus"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: message._id,
            read: newRead,
          }),
        }
      );

      if (response.ok) {
        console.log("Contacted status updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update read/unread status.");
      // reset the switch
      setRead(!newRead);
    }
  };

  return (
    <div className="flex flex-col w-85vw lg:w-50vw xl:w-45vw xxl:w-40vw border-y-2 border-customGold m-5 p-5 text-left">
      <h1 className="font-bigola text-customCream text-3xl mb-2">
        {message.firstName} {message.lastName}
      </h1>
      <p className="font-hypatia text-lg lg:text-xl mb-1">{message.email}</p>
      <p className="font-hypatia text-lg lg:text-xl mb-1">{message.number}</p>
      <p className="font-hypatia text-lg lg:text-xl mb-1">
        Sent: {formattedDate}
      </p>
      <p className="font-hypatia text-lg lg:text-xl lmb-1">
        Preferred date: {formattedPreferredDate}
      </p>
      <p className="font-hypatia text-lg lg:text-xl mb-1">
        How did you hear? {message.howDidYouHear}
      </p>
      <p className="font-hypatia text-lg lg:text-xl mb-1">
        Budget: {message.budget}
      </p>
      <p className="font-hypatia text-lg lg:text-xl">"{message.message}"</p>
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
      <div className="flex flex-row mt-2">
        <button className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 tracking-wider">
          DELETE
        </button>
      </div>
    </div>
  );
};

export default MessageCard;
