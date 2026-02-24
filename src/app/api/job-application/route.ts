import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/db";
import JobApplication from "@/models/JobApplication";
import { appendJobApplicationToSheet } from "@/app/actions/appendToSheets";
import { Resend } from "resend";

const contactEmail = process.env.CONTACT_EMAIL!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  await connectToMongoDB();

  try {
    const applications = await JobApplication.find()
      .select("-resume")
      .sort({ submittedAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Job applications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job applications." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  await connectToMongoDB();

  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const hearAbout = formData.get("hearAbout") as string;
    const whyApply = formData.get("whyApply") as string;
    const musicGenres = formData.get("musicGenres") as string;
    const threeAlbums = formData.get("threeAlbums") as string;
    const barExperience = formData.get("barExperience") as string;
    const craftBeerWine = formData.get("craftBeerWine") as string;
    const busyRush = formData.get("busyRush") as string;
    const difficultFeedback = formData.get("difficultFeedback") as string;
    const availability = formData.get("availability") as string;
    const howSoonStart = formData.get("howSoonStart") as string;
    const anythingElse = (formData.get("anythingElse") as string) || undefined;

    const resumeFile = formData.get("resume") as File | null;
    if (!resumeFile || resumeFile.size === 0) {
      return NextResponse.json(
        { error: "Resume (PDF) is required." },
        { status: 400 },
      );
    }
    if (resumeFile.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted for resume." },
        { status: 400 },
      );
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const application = new JobApplication({
      email,
      firstName,
      lastName,
      phone,
      hearAbout,
      whyApply,
      musicGenres,
      threeAlbums,
      barExperience,
      craftBeerWine,
      busyRush,
      difficultFeedback,
      availability,
      howSoonStart,
      anythingElse,
      resume: buffer,
      resumeContentType: resumeFile.type,
    });

    await application.save();

    const applicantName = `${firstName} ${lastName}`.trim();

    try {
      const { error: notificationError } = await resend.emails.send({
        from: "LHI <onboarding@resend.dev>",
        to: [contactEmail],
        subject: `New job application from ${applicantName}`,
        text: `${applicantName} just submitted a new application.`,
      });

      if (notificationError) {
        console.error(
          "[job-application] Notification email failed:",
          notificationError,
        );
      }
    } catch (notificationError) {
      console.error(
        "[job-application] Notification email threw:",
        notificationError,
      );
    }

    try {
      await appendJobApplicationToSheet({
        firstName,
        lastName,
        email,
        phone,
        hearAbout,
        whyApply,
        musicGenres,
        threeAlbums,
        barExperience,
        craftBeerWine,
        busyRush,
        difficultFeedback,
        availability,
        howSoonStart,
        anythingElse,
      });
    } catch (sheetsError) {
      const msg =
        sheetsError instanceof Error
          ? sheetsError.message
          : String(sheetsError);
      console.error(
        "[job-application] Google Sheet append failed:",
        msg,
        sheetsError,
      );
    }

    return NextResponse.json(
      { message: "Application submitted successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Job application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application." },
      { status: 500 },
    );
  }
}
