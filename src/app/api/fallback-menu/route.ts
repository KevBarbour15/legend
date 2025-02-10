import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import { connectToMongoDB } from "@/lib/db";

import { getMenu } from "@/app/actions/getMenu.server";

// this is the fallback menu that is used when server side rendering fails
export async function GET(req: NextRequest) {
  await connectToMongoDB();
  try {
    const menu = await getMenu();

    return NextResponse.json(menu, { status: 200 });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch menu." },
      { status: 500 },
    );
  }
}
