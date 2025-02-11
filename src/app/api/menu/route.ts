import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Menu from "@/models/Menu";

export async function GET() {
  try {
    await connectToMongoDB();

    const session = await Menu.startSession();
    session.startTransaction();

    try {
      let latestMenu = await Menu.findOne({ isLatest: true }).session(session);

      if (!latestMenu) {
        latestMenu = await Menu.findOne().session(session);

        if (latestMenu) {
          latestMenu.isLatest = true;
          await latestMenu.save({ session });
        } else {
          return NextResponse.json(
            { success: false, error: "No menu found." },
            { status: 404 },
          );
        }
      }

      await session.commitTransaction();
      return NextResponse.json({ success: true, menu: latestMenu.menu });
    } catch (error) {
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
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
      },
      { status: 500 },
    );
  }
}
