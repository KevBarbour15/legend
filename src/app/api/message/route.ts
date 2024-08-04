// pages/api/events.ts
import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/Message";

// GET request handler ************************************************************************************************
export async function GET(req: NextRequest) {
  try {
    const messages = await Message.find();

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch messages." },
      { status: 500 },
    );
  }
}

// POST request handler ************************************************************************************************
export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      preferredDate,
      budget,
      howDidYouHear,
      message,
    } = await req.json();

    const newMessage = new Message({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      preferredDate: preferredDate,
      budget: budget,
      howDidYouHear: howDidYouHear,
      message: message,
    });

    await newMessage.save();

    return NextResponse.json(
      { message: "Message successfully sent." },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to create message." },
      { status: 500 },
    );
  }
}

// PUT request handler ************************************************************************************************
export async function PUT(req: NextRequest) {
  try {
    // parse the action from the query params
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    switch (action) {
      case "updateContactedStatus":
        return updateContactedStatus(req);
      case "updateReadStatus":
        return updateReadStatus(req);
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

async function updateContactedStatus(req: NextRequest) {
  try {
    const { _id, contacted } = await req.json();

    const response = await Message.findByIdAndUpdate(
      _id,
      { contacted: contacted },
      { new: true },
    );

    if (response) {
      return NextResponse.json(
        { message: "Contacted status updated successfully." },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "Failed to update contacted status." },
        { status: 400 },
      );
    }
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to update contacted status." },
      { status: 500 },
    );
  }
}

async function updateReadStatus(req: NextRequest) {
  try {
    const { _id, read } = await req.json();

    const response = await Message.findByIdAndUpdate(
      _id,
      { read: read },
      { new: true },
    );

    if (response) {
      return NextResponse.json(
        { message: "Read / unread status updated successfully." },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "Failed to update read / unread status." },
        { status: 400 },
      );
    }
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to update read / unread status." },
      { status: 500 },
    );
  }
}

// DELETE request handler ************************************************************************************************
export async function DELETE(req: NextRequest) {
  try {
    const { messageId } = await req.json();
    await Message.findByIdAndDelete(messageId);

    return NextResponse.json({ message: "Message deleted." }, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to delete message." },
      { status: 500 },
    );
  }
}
