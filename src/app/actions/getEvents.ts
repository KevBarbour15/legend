"use server";

import { connectToMongoDB } from "@/lib/db";
import Event from "@/models/Event";
import { Event as EventType } from "@/data/events";

interface EventResponse {
  events?: EventType[];
  totalCount?: number;
  error?: string;
}

interface AllEventsResponse {
  upcoming: EventType[];
  past: EventType[];
}

function serializeEvent(doc: any): EventType {
  return {
    _id: doc?._id?.toString?.() ?? String(doc?._id),
    title: String(doc?.title ?? ""),
    date:
      doc?.date instanceof Date
        ? doc.date.toISOString()
        : String(doc?.date ?? ""),
    time: String(doc?.time ?? ""),
    description: String(doc?.description ?? ""),
    notes: String(doc?.notes ?? ""),
    image_url: String(doc?.image_url ?? ""),
    is_photo: Boolean(doc?.is_photo),
    is_public: Boolean(doc?.is_public),
    upcoming: Boolean(doc?.upcoming),
  };
}

export async function getAllEvents(): Promise<AllEventsResponse> {
  try {
    await connectToMongoDB();

    const upcomingEvents = await Event.find({ upcoming: true })
      .limit(100)
      .sort({ date: 1 })
      .lean()
      .exec();

    const pastEvents = await Event.find({ upcoming: false })
      .limit(100)
      .sort({ date: -1 })
      .lean()
      .exec();

    return {
      upcoming: upcomingEvents.map(serializeEvent),
      past: pastEvents.map(serializeEvent),
    };
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw new Error("Failed to fetch events");
  }
}

export async function getEvents(
  eventType: "upcoming" | "past",
  lastIndex: number,
): Promise<EventResponse> {
  try {
    await connectToMongoDB();
    const limit = 100;

    // First, get total count of events of the requested type
    const totalCount = await Event.countDocuments({
      upcoming: eventType === "upcoming",
    });

    // If lastIndex is beyond total count, return empty array
    if (lastIndex >= totalCount) {
      return { events: [], totalCount: 0 };
    }

    let events: EventType[] = await Event.aggregate([
      // Match the correct event type
      { $match: { upcoming: eventType === "upcoming" } },
      // Sort first
      { $sort: { date: eventType === "upcoming" ? 1 : -1 } },
      // Skip to the correct position
      { $skip: lastIndex },
      // Limit results
      { $limit: limit },
    ]);

    if (!events) {
      return { error: "No events found" };
    }

    return { events: events.map(serializeEvent) };
  } catch (error) {
    console.error(`Error fetching ${eventType} events:`, error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch events",
    };
  }
}
