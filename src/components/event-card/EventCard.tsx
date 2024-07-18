import { formatTime } from "@/utils/time";

interface Event {
  title: string;
  date: string;
  time: string;
  description: string;
}

interface EventCardProps {
  event: Event;
  inDashboard: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, inDashboard }) => {
  const formattedDate = new Date(event.date).toLocaleDateString();
  const formattedTime = formatTime(event.time);

  return (
    <>
      <div className="flex flex-col w-85vw lg:w-50vw xl:w-45vw xxl:w-40vw border-y-2 border-customGold m-5 p-5 text-left">
        {inDashboard ? (
          <>
            <h1 className="font-bigola text-customCream text-3xl mb-2">
              {event.title}
            </h1>
            <p className="font-hypatia text-lg lg:text-xl">{event.description}</p>
            <p className="font-hypatia text-lg lg:text-xl mb-1">{formattedDate}</p>
            <p className="font-hypatia text-lg lg:text-xl mb-1">{formattedTime}</p>
      
            <div className="flex flex-row mt-2">
              <button className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 mr-7 tracking-wider">
                EDIT
              </button>
              <button className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 tracking-wider">
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
    </>
  );
};

export default EventCard;
