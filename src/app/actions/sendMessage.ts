"use server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template/EmailTemplate";
import { ReactElement } from "react";

const contactEmail = process.env.CONTACT_EMAIL!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const {
    formType,
    name,
    email,
    phone,
    message,
    eventDate,
    eventTime,
    eventTypeDescription,
    musicDescription,
    guests,
  } = await req.json();

  try {
    const { error } = await resend.emails.send({
      from: "LHI <onboarding@resend.dev>",
      to: [contactEmail],
      subject: `New ${formType} inquiry from ${name}`,
      react: EmailTemplate({
        formType,
        name,
        email,
        message,
        phone,
        eventDate,
        eventTime,
        eventTypeDescription,
        musicDescription,
        guests,
      }) as ReactElement,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
