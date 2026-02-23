import { getSheetsClient } from "@/lib/sheets";

type AppendPayload = {
  formType: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  eventDate?: string;
  eventTime?: string;
  eventType?: string;
  eventTypeDescription?: string;
  musicType?: string;
  musicDescription?: string;
  guests?: string | number;
};

export type JobApplicationSheetPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hearAbout: string;
  whyApply: string;
  musicGenres: string;
  threeAlbums: string;
  barExperience: string;
  craftBeerWine: string;
  busyRush: string;
  difficultFeedback: string;
  availability: string;
  howSoonStart: string;
  anythingElse?: string;
};

const RANGE_BY_FORM_TYPE: Record<string, string> = {
  general: "General!A1",
  event: "Event!A1",
  dj: "Dj!A1",
};

const HOW_SOON_LABELS: Record<string, string> = {
  asap: "ASAP",
  within_2_weeks: "Within 2 weeks",
  next_month: "Next month",
  just_exploring: "Just exploring for now",
};

export async function appendMessageToSheet(payload: AppendPayload) {
  console.log("SA EMAIL", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

  const sheets = getSheetsClient();

  const timestamp = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const range = RANGE_BY_FORM_TYPE[payload.formType] ?? "General!A1";

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          timestamp,
          payload.name ? payload.name : "",
          payload.email ? payload.email : "",
          payload.phone ? payload.phone : "",
          payload.message ? "Message: " + payload.message : "",
          payload.eventDate ? "Event Date: " + payload.eventDate : "",
          payload.eventTime ? "Event Time: " + payload.eventTime : "",
          payload.eventTypeDescription ? payload.eventTypeDescription : "",
          payload.musicDescription ? payload.musicDescription : "",
          payload.guests != null ? String(payload.guests) + " guests" : "",
        ],
      ],
    },
  });
}

const JOB_APPLICATION_SHEET = "Job Application";
const JOB_APPLICATION_RANGE = "Job Application!A1";

const JOB_APPLICATION_HEADERS = [
  "Timestamp",
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "How heard",
  "Why apply",
  "Music genres",
  "3 albums",
  "Bar experience",
  "Craft beer/wine",
  "Busy rush",
  "Difficult feedback",
  "Availability",
  "How soon start",
  "Anything else",
];

export async function appendJobApplicationToSheet(
  payload: JobApplicationSheetPayload
) {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID not set");

  const timestamp = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const howSoonLabel =
    HOW_SOON_LABELS[payload.howSoonStart] ?? payload.howSoonStart;

  const dataRow = [
    timestamp,
    payload.firstName ?? "",
    payload.lastName ?? "",
    payload.email ?? "",
    payload.phone ?? "",
    payload.hearAbout ?? "",
    payload.whyApply ?? "",
    payload.musicGenres ?? "",
    payload.threeAlbums ?? "",
    payload.barExperience ?? "",
    payload.craftBeerWine ?? "",
    payload.busyRush ?? "",
    payload.difficultFeedback ?? "",
    payload.availability ?? "",
    howSoonLabel,
    payload.anythingElse ?? "",
  ];

  let sheetExists = false;
  let hasHeader = false;

  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${JOB_APPLICATION_SHEET}!A1`,
    });
    sheetExists = true;
    hasHeader = !!(data.values && data.values.length > 0);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("Unable to parse range") ||
      message.includes("not found") ||
      message.includes("404")
    ) {
      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: { title: JOB_APPLICATION_SHEET },
                },
              },
            ],
          },
        });
        sheetExists = true;
      } catch (createErr) {
        console.error(
          "[appendJobApplicationToSheet] Failed to create sheet tab:",
          createErr instanceof Error ? createErr.message : createErr
        );
        throw createErr;
      }
    } else {
      console.error(
        "[appendJobApplicationToSheet] Sheets get error:",
        message
      );
      throw err;
    }
  }

  if (sheetExists && !hasHeader) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${JOB_APPLICATION_SHEET}!A1:P1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [JOB_APPLICATION_HEADERS] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: JOB_APPLICATION_RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [dataRow] },
  });
}
