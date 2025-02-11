import { NextRequest, NextResponse } from "next/server";
import { updateMenu } from "@/app/actions/updateMenu.server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log("Received Square webhook event:", payload.type);

    const response = await updateMenu();

    if (!response.success) {
      return NextResponse.json(
        { message: "Failed to fetch events" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Invalid webhook payload" },
      { status: 400 },
    );
  }
}
