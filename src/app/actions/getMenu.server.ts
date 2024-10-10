"use server";
import { MenuStructure } from "@/types/menu.ts";
import { headers } from "next/headers";

export async function getMenu(): Promise<MenuStructure> {
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const apiUrl = `${protocol}://${host}/api/catalog`;
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
