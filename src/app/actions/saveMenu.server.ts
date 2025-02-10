import { SaveMenuResponse } from "@/data/save-menu";
import { MenuStructure } from "@/data/menu";

import { connectToMongoDB } from "@/lib/db";

import Menu from "@/models/Menu";

export async function saveMenu(menu: MenuStructure): Promise<SaveMenuResponse> {
  await connectToMongoDB();

  const session = await Menu.startSession();
  session.startTransaction();

  try {
    if (!menu) {
      return {
        success: false,
        error: "Menu is missing.",
      };
    }

    const menus = await Menu.find().session(session);

    if (menus.length >= 2) {
      const oldMenu = menus.find((menu) => !menu.isLatest);
      if (oldMenu) {
        await oldMenu.deleteOne({ session });
      }

      await Menu.findOneAndUpdate(
        { isLatest: true },
        { isLatest: false },
      ).session(session);
    }

    const newMenu = new Menu({
      menu,
      isLatest: true,
    });

    await newMenu.save({ session });

    await session.commitTransaction();
    console.log("Menu saved successfully");
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
