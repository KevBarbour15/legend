import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import Menu from "@/models/Menu";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

      // do not cache menu date is fresh from the db
      return NextResponse.json(
        { success: true, menu: latestMenu.menu },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      );
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
