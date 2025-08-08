import { NextRequest, NextResponse } from "next/server";
import { getVariantsInventory } from "@/app/actions/shopify";

export async function POST(req: NextRequest) {
  const { variantIds } = await req.json();
  if (!Array.isArray(variantIds)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const nodes = await getVariantsInventory(variantIds);
  return NextResponse.json(
    { nodes },
    {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  );
}
