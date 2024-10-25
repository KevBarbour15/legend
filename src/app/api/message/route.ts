import { NextRequest, NextResponse } from "next/server";
import Message from "@/models/Message";
import { connectToMongoDB } from "@/lib/db";

import { sendNotificationEmail } from "@/app/actions/sendNotificationEmail.server";

// GET request handler ************************************************************************************************
export async function GET(req: NextRequest) {
  await connectToMongoDB();

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
  await connectToMongoDB();
  console.log("POST request received.");
  try {
    const {
      name,
      email,
      phone,
      message,
      formType,
      eventDate,
      eventType,
      musicType,
      guests,
      eventTime,
    } = await req.json();

    let newMessage;

    if (formType === "event") {
      newMessage = new Message({
        name: name,
        email: email,
        phone: phone,
        message: message,
        formType: formType,
        eventDate: eventDate,
        eventTime: eventTime,
        eventType: eventType,
        musicType: musicType,
        guests: guests,
      });
    } else {
      newMessage = new Message({
        name: name,
        email: email,
        phone: phone,
        message: message,
        formType: formType,
      });
    }
  
    const response = await newMessage.save();

    if (response._id) {
      const subject = `New message from ${name}.`;
      const text = `You have received a new message from ${name}.

Email: ${email}

Phone: ${phone}

Message: ${message}`;

      try {
        await sendNotificationEmail({
          subject: subject,
          text: text,
        });
      } catch (error) {
        console.log("Error sending email: ", error);
      }
    }

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
  await connectToMongoDB();

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
  await connectToMongoDB();

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
  await connectToMongoDB();

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
  await connectToMongoDB();

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
