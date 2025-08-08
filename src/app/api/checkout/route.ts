import { NextRequest, NextResponse } from "next/server";
import { createCartAndGetCheckoutUrl } from "@/app/actions/shopify";

export async function POST(req: NextRequest) {
  try {
    const { lines } = await req.json();
    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { error: "No cart lines provided" },
        { status: 400 },
      );
    }

    const checkoutUrl = await createCartAndGetCheckoutUrl(lines);
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Could not generate checkout URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
