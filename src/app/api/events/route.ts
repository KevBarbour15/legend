// pages/api/events.ts
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";

export async function GET(req: NextRequest) {
  try {
    const events = await Event.find();
    console.log("Events: ", events);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    
    console.log("Error: ", error);
    return NextResponse.json({ error: "Failed to fetch events!" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Ensure the request body is parsed correctly

    // Print the body to debug
    console.log("Request Body: ", body);

    const { title, date, time, description } = body;

    

    if (!title || !date || !time || !description) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 }
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
      { message: "Event created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to create event!" },
      { status: 500 }
    );
  }
}
