import { formatTime } from "@/utils/time";

interface Message {
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
}

interface MessageCardProps {
  message: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const formattedDate = new Date(message.sentAt).toLocaleDateString();

  return (
    <div className="flex flex-col w-3/6 border-y-2 border-customGold m-5 p-5 text-left">
      <h1 className="font-bigola text-customCream text-4xl mb-2">
        {message.firstName} {message.lastName}
      </h1>
      <p className="font-hypatia text-lg mb-1">{message.email}</p>
      <p className="font-hypatia text-lg mb-1">{message.number}</p>
      <p className="font-hypatia text-lg mb-1">{formattedDate}</p>
      <p className="font-hypatia text-lg mb-1">{message.preferredDate}</p>
      <p className="font-hypatia text-lg mb-1">{message.howDidYouHear}</p>
      <p className="font-hypatia text-lg mb-1">{message.budget}</p>
      <p className="font-hypatia text-lg">{message.message}</p>
      <div className="flex flex-row mt-2">
        <button className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 mr-7 tracking-wider">
          Mark as Read
        </button>
        <button className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 tracking-wider">
          Delete Message
        </button>
      </div>
    </div>
  )
};

export default MessageCard;