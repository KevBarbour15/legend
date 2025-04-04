"use server";

import { connectToMongoDB } from "@/lib/db";
import Event from "@/models/Event";
import { Event as EventType } from "@/data/events";

interface EventResponse {
  events?: EventType[];
  totalCount?: number;
  error?: string;
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

    return { events };
  } catch (error) {
    console.error(`Error fetching ${eventType} events:`, error);
    return {
      error: error instanceof Error ? error.message : "Failed to fetch events",
    };
  }
}
