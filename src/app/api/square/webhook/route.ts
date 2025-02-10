import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json(); // Parse JSON payload properly

    // Verify the webhook signature here (recommended)
    // Square sends a signature in the header that you should validate

    console.log("Webhook received:", payload);

    return NextResponse.json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Invalid webhook payload" },
      { status: 400 },
    );
  }
}
