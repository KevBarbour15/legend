import Menu from "@/models/Menu";
import { connectToMongoDB } from "@/lib/db";
import { MenuStructure } from "@/data/menu";

export const dynamic = "force-dynamic";

export async function getMenu(): Promise<MenuStructure | null> {
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
          console.log("No menu found in database");
          return null;
        }
      }

      await session.commitTransaction();

      return latestMenu.menu as MenuStructure;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error fetching menu:", error);

    // Check if it's a connection error
    if (error instanceof Error && error.message.includes("MONGODB_URI")) {
      console.error("MongoDB URI not configured");
      throw new Error("Database not configured");
    }

    // Check if it's a connection error
    if (error instanceof Error && error.message.includes("connect")) {
      console.error("Failed to connect to database");
      throw new Error("Database connection failed");
    }

    throw new Error("Failed to fetch menu data");
  }
}
