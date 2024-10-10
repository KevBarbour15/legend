"use server";

import { MenuStructure } from "@/types/menu.ts";

export async function getMenu(): Promise<MenuStructure> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT || 3000}`;

  const apiUrl = `${baseUrl}/api/catalog`;
  console.log("apiUrl:", apiUrl);
  try {
    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const menuData: MenuStructure = await response.json();

    return menuData;
  } catch (error) {
    console.error("Error fetching menu data:", error);

    throw new Error("Failed to fetch menu data");
  }
}
