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

const RANGE_BY_FORM_TYPE: Record<string, string> = {
  general: "General!A1",
  event: "Event!A1",
  dj: "Dj!A1",
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
