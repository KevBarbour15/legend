"use server";

export async function updateMenu() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/square/catalog`,
      {
        cache: "default",
        headers: {
          "Content-Type": "application/json",
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
