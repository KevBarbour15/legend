// pages/api/events.ts
import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/Message";

// GET request handler ************************************************************************************************
export async function GET(req: NextRequest) {
  try {
    // parse the action from the query params
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    switch (action) {
      case "getMessages":
        return getMessages();
      default:
        return NextResponse.json(
          { error: "Failed to process request." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}

// fetch the messages
async function getMessages() {
  try {
    const messages = await Message.find();
    console.log("Messages: ", messages);

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch messages." },
      { status: 500 }
    );
  }
}

// POST request handler ************************************************************************************************
export async function POST(req: NextRequest) {
  try {
    // parse the action from the query params
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    switch (action) {
      case "createMessage":
        return createMessage(req);
      default:
        return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}

// create a new message
async function createMessage(req: NextRequest) {
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
      { status: 201 }
    );
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to create message." },
      { status: 500 }
    );
  }
}
