import { SaveFallbackMenuResponse } from "@/types/fallback-menu";
import { MenuStructure } from "@/types/menu";

import { connectToMongoDB } from "@/lib/db";

import FallbackMenu from "@/models/FallbackMenu";

export async function saveFallbackMenu(
  menu: MenuStructure,
): Promise<SaveFallbackMenuResponse> {
  await connectToMongoDB();

  const session = await FallbackMenu.startSession();
  session.startTransaction();

  try {
    if (!menu) {
      return {
        success: false,
        error: "Menu is missing.",
      };
    }

    const menus = await FallbackMenu.find().session(session);

    if (menus.length >= 2) {
      const oldMenu = menus.find((menu) => !menu.isLatest);
      if (oldMenu) {
        await oldMenu.deleteOne({ session });
      }

      await FallbackMenu.findOneAndUpdate(
        { isLatest: true },
        { isLatest: false },
      ).session(session);
    }

    const newMenu = new FallbackMenu({
      menu,
      isLatest: true,
    });

    await newMenu.save({ session });

    await session.commitTransaction();

    return { success: true };
  } catch (error) {
    console.error("Error saving fallback menu:", error);

    await session.abortTransaction();

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save fallback menu.",
    };
  } finally {
    session.endSession();
  }
}
