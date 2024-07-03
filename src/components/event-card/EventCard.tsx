import { formatTime } from "@/utils/time";

interface Event {
  title: string;
  date: string;
  time: string;
  description: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString();
  const formattedTime = formatTime(event.time);

  return (
    <div className="flex flex-col w-3/6 border-y-2 border-customGold m-5 p-5 text-left">
      <h1 className="font-bigola text-customCream text-4xl mb-2">{event.title}</h1>
      <p className="font-hypatia text-lg mb-1">{formattedDate}</p>
      <p className="font-hypatia text-lg mb-1">{formattedTime}</p>
      <p className="font-hypatia text-lg">{event.description}</p>
    </div>
  );
};

export default EventCard;
