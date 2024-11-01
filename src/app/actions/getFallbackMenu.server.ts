import { GetFallbackMenuResponse } from "@/data/fallback-menu";

import { connectToMongoDB } from "@/lib/db";

import FallbackMenu from "@/models/FallbackMenu";

export async function getFallbackMenu(): Promise<GetFallbackMenuResponse> {
  await connectToMongoDB();

  const session = await FallbackMenu.startSession();
  session.startTransaction();

  try {
    let latestMenu = await FallbackMenu.findOne({ isLatest: true }).session(
      session,
    );

    if (!latestMenu) {
      latestMenu = await FallbackMenu.findOne().session(session);
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
    console.error("Error retrieving the fallback menu:", error);

    await session.abortTransaction();

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to retrieve fallback menu.",
    };
  } finally {
    session.endSession();
  }
}
