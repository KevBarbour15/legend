import { NextRequest, NextResponse } from "next/server";
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY as string;
const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
const DATACENTER = MAILCHIMP_API_KEY.split("-")[1];

// POST request handler ************************************************************************************************
export async function POST(req: NextRequest) {
  try {
    // if keys are not found, return an error
    if (!MAILCHIMP_API_KEY || !AUDIENCE_ID) {
      return NextResponse.json(
        { error: "Mailchimp API key or audience ID not found." },
        { status: 500 },
      );
    }

    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/`;
    const { email, name } = await req.json();

    let data;

    if (!name) {
      data = {
        email_address: email,
        status: "subscribed",
      };
    } else {
      data = {
        name: name,
        email_address: email,
        status: "subscribed",
      };
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `apikey ${MAILCHIMP_API_KEY}`,
    };

    // post request to mailchimp
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: headers,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to subscribe user." },
      { status: 500 },
    );
  }
}
