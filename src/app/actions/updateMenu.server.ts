"use server";

export async function updateMenu() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/square/catalog`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );

    if (!response.ok) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Error fetching catalog:", error);
    throw new Error("Failed to fetch catalog");
  }
}
