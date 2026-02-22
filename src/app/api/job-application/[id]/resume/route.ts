import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import JobApplication from "@/models/JobApplication";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToMongoDB();

  try {
    const { id } = await params;
    console.log("[Resume API] GET resume for id:", id);

    const doc = await JobApplication.findById(id)
      .select("resume resumeContentType")
      .exec();

    if (!doc) {
      console.log("[Resume API] 404 - no doc for id:", id);
      return NextResponse.json(
        { error: "Resume not found." },
        { status: 404 }
      );
    }

    const rawResume = doc.resume;
    if (!rawResume) {
      console.log("[Resume API] 404 - no resume field for id:", id);
      return NextResponse.json(
        { error: "Resume not found." },
        { status: 404 }
      );
    }

    let buffer: Buffer;
    if (Buffer.isBuffer(rawResume)) {
      buffer = rawResume;
    } else if (rawResume && typeof (rawResume as { buffer?: Uint8Array }).buffer !== "undefined") {
      buffer = Buffer.from((rawResume as { buffer: Uint8Array }).buffer);
    } else if (rawResume instanceof Uint8Array) {
      buffer = Buffer.from(rawResume);
    } else {
      buffer = Buffer.from(rawResume as ArrayBuffer);
    }

    const contentType = doc.resumeContentType || "application/pdf";
    console.log("[Resume API] returning PDF, buffer length:", buffer.length, "contentType:", contentType);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="resume-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[Resume API] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume." },
      { status: 500 }
    );
  }
}
