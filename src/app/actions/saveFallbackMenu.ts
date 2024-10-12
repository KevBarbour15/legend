import { SaveFallbackMenuResponse } from "@/types/fallback-menu";
import { MenuStructure } from "@/types/menu";

import { connectToMongoDB } from "@/lib/db";

import FallbackMenu from "@/models/FallbackMenu";

export async function saveFallbackMenu(
  menu: MenuStructure,
): Promise<SaveFallbackMenuResponse> {
  await connectToMongoDB();

  try {
    if (!menu) {
      return {
        success: false,
        error: "Menu is missing.",
      };
    }

    const menus = await FallbackMenu.find();

    console.log(menus.length);

    const fallbackMenu = new FallbackMenu({
      menu,
    });

    const response = await fallbackMenu.save();

    if (response) {
      console.log("Fallback menu saved successfully.");
    }
  } catch (error) {
    console.error("Error saving fallback menu:", error);

    return {
      success: false,
      error: "Failed to save fallback menu.",
    };
  }

  return {
    success: true,
  };
}
