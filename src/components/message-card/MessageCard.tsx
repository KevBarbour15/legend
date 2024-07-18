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
  const formattedPreferredDate = new Date(
    message.preferredDate
  ).toLocaleDateString();

  return (
    <div className="flex flex-col w-85vw lg:w-50vw xl:w-45vw xxl:w-40vw border-y-2 border-customGold m-5 p-5 text-left">
      <h1 className="font-bigola text-customCream text-3xl mb-2">
        {message.firstName} {message.lastName}
      </h1>
      <p className="font-hypatia text-lg lg:text-xl mb-1">{message.email}</p>
      <p className="font-hypatia text-lg lg:text-xl mb-1">{message.number}</p>
      <p className="font-hypatia text-lg lg:text-xl mb-1">Sent: {formattedDate}</p>
      <p className="font-hypatia text-lg lg:text-xl lmb-1">Preferred date: {formattedPreferredDate}</p>
      <p className="font-hypatia text-lg lg:text-xl mb-1">How did you hear? {message.howDidYouHear}</p>
      <p className="font-hypatia text-lg lg:text-xl mb-1">Budget: {message.budget}</p>
      <p className="font-hypatia text-lg lg:text-xl">"{message.message}"</p>
      <p>**** adding ability to mark message as read ****</p>
      <p>**** adding ability to mark sender as contacted ****</p>
      <div className="flex flex-row mt-2">
        <button className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 tracking-wider">
          DELETE
        </button>
      </div>
    </div>
  );
};

export default MessageCard;
