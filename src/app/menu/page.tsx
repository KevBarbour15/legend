import { MenuStructure } from "@/types.ts";
import MenuClient from "@/components/menu-client/MenuClient";
import { headers } from "next/headers";

export const revalidate = 60; // Set to 86400 for daily revalidation

async function getMenuData(): Promise<{
  menuData: MenuStructure | null;
  error?: string;
  timestamp: string;
}> {
  try {
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const apiUrl = `${protocol}://${host}/api/catalog`;

    const response = await fetch(apiUrl, { next: { revalidate } });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const menuData = await response.json();
    return {
      menuData,
      timestamp: new Date().toISOString(),
      error: undefined,
    };
  } catch (error) {
    console.error("Failed to fetch menu data:", error);
    return {
      menuData: null,
      error: "Failed to load menu data",
      timestamp: new Date().toISOString(),
    };
  }
}

export default async function MenuPage() {
  const { menuData, error, timestamp } = await getMenuData();
  console.log(`Last updated: ${timestamp}`);
  return (
    <>
      <MenuClient initialData={menuData} error={error} />
      <div className="mt-4 text-xs text-gray-500"></div>
    </>
  );
}
