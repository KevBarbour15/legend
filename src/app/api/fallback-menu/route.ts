import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import { connectToMongoDB } from "@/lib/db";

import { getFallbackMenu } from "@/app/actions/getFallbackMenu.server";

// this is the fallback menu that is used when server side rendering fails
export async function GET(req: NextRequest) {
  try {
    const fallbackMenu = await getFallbackMenu();

    return NextResponse.json(fallbackMenu, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch fallback menu." },
      { status: 500 },
    );
  }
}
