import { MenuStructure } from "@/types.ts";
import MenuClient from "@/components/menu-client/MenuClient";
import { headers } from "next/headers";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Revalidate every 60 seconds
export const revalidate = 60;

async function getMenuData(): Promise<{
  menuData: MenuStructure | null;
  error?: string;
  timestamp: string;
}> {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Fetching menu data`);

  try {
    const headersList = headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    const apiUrl = `${protocol}://${host}/api/catalog`;
    console.log(`[${timestamp}] Fetching from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        "x-timestamp": timestamp,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const menuData = await response.json();
    console.log(`[${timestamp}] Menu data fetched successfully`);
    console.log(JSON.stringify(menuData, null, 2)); // Log full menu data

    const cannedBottled = menuData["Canned / Bottled"];
    const childCategories = cannedBottled?.childCategories || [];
    for (const childCategory of childCategories) {
      if (childCategory.name === "Lagers, Pilsners, Kolsch") {
        console.log(JSON.stringify(childCategory, null, 2));
      }
    }

    return { menuData, timestamp, error: undefined };
  } catch (error) {
    console.error(`[${timestamp}] Failed to fetch menu data:`, error);
    return {
      menuData: null,
      error: "Failed to load menu data",
      timestamp,
    };
  }
}

export default async function MenuPage() {
  console.log(`[${new Date().toISOString()}] MenuPage component rendered`);
  const { menuData, error, timestamp } = await getMenuData();

  return (
    <>
      <MenuClient initialData={menuData} error={error} />
      <div style={{ display: "none" }}>Last updated: {timestamp}</div>
    </>
  );
}
