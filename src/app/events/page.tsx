import { getAllEvents } from "@/app/actions/getEvents";
import EventsContent from "./EventsContent";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Events() {
  try {
    const { upcoming, past } = await getAllEvents();
    
    return (
      <EventsContent 
        initialUpcomingEvents={upcoming} 
        initialPastEvents={past} 
      />
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return notFound();
  }
}
