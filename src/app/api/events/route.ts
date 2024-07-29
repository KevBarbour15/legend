// pages/api/events.ts
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";

// GET request handler ************************************************************************************************
export async function GET(req: NextRequest) {
  try {
    // parse the action from the query params
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    switch (action) {
      case "getEvents":
        return getEvents();
      default:
        return NextResponse.json( 
          { error: "Failed to process request." },
          { status: 400 },
        );
    }
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 },
    );
  }
}

// fetch the events
async function getEvents() {
  try {
    const events = await Event.find();
    //console.log("Events: ", events);
    
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch events." },
      { status: 500 },
    );
  }
}

// POST request handler ************************************************************************************************
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    switch (action) {
      case "createEvent":
        return createEvent(req);
      default:
        return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 },
    );
  }
}

// create an event
async function createEvent(req: NextRequest) {
  try {
    // Ensure the request body is parsed correctly
    const body = await req.json();

    const { title, date, time, description } = body;

    if (!title || !date || !time || !description) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 },
      );
    }

    const event = new Event({
      title,
      date,
      time,
      description,
    });

    await event.save();

    return NextResponse.json(
      { message: "Event created successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to create event." },
      { status: 500 },
    );
  }
}

// PUT request handler ************************************************************************************************
export async function PUT(req: NextRequest) {
  try {
    const { _id, title, date, time, description, image_url, notes } = await req.json();

    await Event.findByIdAndUpdate(_id, { title, date, time, description, image_url, notes });

    return NextResponse.json({ message: "Event updated." }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to update event." },
      { status: 500 },
    );
  }
}

// DELETE request handler ************************************************************************************************
export async function DELETE(req: NextRequest) {
  try {
    const { eventId } = await req.json();
    await Event.findByIdAndDelete(eventId);

    return NextResponse.json({ message: "Event deleted." }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to delete event." },
      { status: 500 },
    );
  }
}
