import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Menu from "@/models/Menu";

export async function GET() {
  console.log("Starting GET request to /api/menu");

  try {
    await connectToMongoDB();
    console.log("MongoDB connected successfully");

    const session = await Menu.startSession();
    session.startTransaction();
    console.log("Transaction started");

    try {
      let latestMenu = await Menu.findOne({ isLatest: true }).session(session);
      console.log(
        "Query result for latest menu:",
        latestMenu ? "found" : "not found",
      );

      if (!latestMenu) {
        latestMenu = await Menu.findOne().session(session);
        console.log(
          "Fallback query result:",
          latestMenu ? "found" : "not found",
        );

        if (latestMenu) {
          console.log("Setting first menu as latest");
          latestMenu.isLatest = true;
          await latestMenu.save({ session });
        } else {
          console.log("No menu found in database");
          return NextResponse.json(
            { success: false, error: "No menu found." },
            { status: 404 },
          );
        }
      }

      await session.commitTransaction();
      console.log("Transaction committed successfully");
      return NextResponse.json({ success: true, menu: latestMenu.menu });
    } catch (error) {
      console.error("Error retrieving the menu:", error);
      await session.abortTransaction();

      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to retrieve menu.",
        },
        { status: 500 },
      );
    } finally {
      session.endSession();
    }
  } catch (connectError) {
    console.error("MongoDB connection error:", connectError);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
      },
      { status: 500 },
    );
  }
}
