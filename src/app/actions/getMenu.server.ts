import { GetMenuResponse } from "@/data/save-menu";

import { connectToMongoDB } from "@/lib/db";

import Menu from "@/models/Menu";

export async function getMenu(): Promise<GetMenuResponse> {
  await connectToMongoDB();

  const session = await Menu.startSession();
  session.startTransaction();

  try {
    let latestMenu = await Menu.findOne({ isLatest: true }).session(session);

    if (!latestMenu) {
      latestMenu = await Menu.findOne().session(session);
      if (latestMenu) {
        console.log("No latest menu found. Setting the first menu as latest.");

        latestMenu.isLatest = true;
        await latestMenu.save({ session });
      } else {
        return {
          success: false,
          error: "No fallback menu found.",
        };
      }
    }

    await session.commitTransaction();

    return { success: true, menu: latestMenu.menu };
  } catch (error) {
    console.error("Error retrieving the menu:", error);

    await session.abortTransaction();

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retrieve menu.",
    };
  } finally {
    session.endSession();
  }
}
