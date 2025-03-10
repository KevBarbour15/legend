import { NextResponse } from "next/server";
import Event from "@/models/Event";
import { connectToMongoDB } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await connectToMongoDB();
    const currentDate = new Date();
    const todayString = currentDate.toISOString().split("T")[0];

    const result = await Event.updateMany(
      {
        date: { $lt: todayString },
        upcoming: true,
      },
      { $set: { upcoming: false } },
    );

    console.log("Events updated: ", result.modifiedCount);
    return NextResponse.json(
      {
        message: "Events status updated",
        updated: result.modifiedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating event statuses:", error);
    return NextResponse.json(
      { error: "Failed to update events" },
      { status: 500 },
    );
  }
}
