import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import { connectToMongoDB } from "@/lib/db";

// GET request handler ************************************************************************************************
export async function GET(req: NextRequest) {
  await connectToMongoDB();
  try {
    const events = await Event.find();

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
  await connectToMongoDB();

  try {
    const body = await req.json();

    const { title, date, time, description, image_url, is_photo } = body;

    if (!title || !date || !time || !description || !image_url || !is_photo) {
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
      image_url,
      is_photo,
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
  await connectToMongoDB();

  try {
    const { _id, title, date, time, description, image_url, notes } =
      await req.json();

    await Event.findByIdAndUpdate(_id, {
      title,
      date,
      time,
      description,
      image_url,
      notes,
    });

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
  await connectToMongoDB();

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
