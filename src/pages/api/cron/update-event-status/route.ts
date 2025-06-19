import { NextResponse } from "next/server";
import Event from "@/models/Event";
import { connectToMongoDB } from "@/lib/db";

export async function GET(req: Request) {
  console.log("Cron job started at:", new Date().toISOString());
  try {
    console.log("Connecting to MongoDB...");
    await connectToMongoDB();
    console.log("Connected to MongoDB successfully");

    const currentDate = new Date();
    const todayString = currentDate.toISOString().split("T")[0];
    console.log("Checking for events before:", todayString);

    const result = await Event.updateMany(
      {
        date: { $lt: todayString },
        upcoming: true,
      },
      { $set: { upcoming: false } },
    );

    console.log("Events updated: ", result.modifiedCount);
    console.log(
      "Cron job completed successfully at:",
      new Date().toISOString(),
    );

    return NextResponse.json(
      {
        message: "Events status updated",
        updated: result.modifiedCount,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating event statuses:", error);
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json(
      {
        error: "Failed to update events",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
