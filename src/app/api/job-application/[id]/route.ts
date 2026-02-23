import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import JobApplication from "@/models/JobApplication";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToMongoDB();

  try {
    const { id } = await params;
    const body = await req.json();
    const { viewed, contacted } = body;

    const update: { viewed?: boolean; contacted?: boolean } = {};
    if (typeof viewed === "boolean") update.viewed = viewed;
    if (typeof contacted === "boolean") update.contacted = contacted;

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "Provide viewed and/or contacted." },
        { status: 400 }
      );
    }

    const doc = await JobApplication.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    )
      .select("-resume")
      .lean()
      .exec();

    if (!doc) {
      return NextResponse.json(
        { error: "Job application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error("Job application PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update job application." },
      { status: 500 }
    );
  }
}
