import * as React from "react";
interface EmailTemplateProps {
  formType: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  eventDate: string | null;
  eventTime: string | null;
  eventTypeDescription: string | null;
  musicDescription: string | null;
  guests: string | null;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
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
}) => (
  <div className="space-y-4">
    <h1 className="border-primary-black font-rem-primary text-2xl capitalize">
      New {formType} inquiry from {name}
    </h1>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <strong>Email:</strong>{" "}
        <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
          {email}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <strong>Phone:</strong>{" "}
        <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
          {phone}
        </a>
      </div>
      {message && (
        <div className="flex flex-col gap-1">
          <strong>Message:</strong>
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
      )}
      {eventDate && (
        <div className="flex items-center gap-2">
          <strong>Event Date:</strong> {eventDate}
        </div>
      )}
      {eventTime && (
        <div className="flex items-center gap-2">
          <strong>Event Time:</strong> {eventTime}
        </div>
      )}
      {eventTypeDescription && (
        <div className="flex items-center gap-2">
          <strong>Event Type:</strong> {eventTypeDescription}
        </div>
      )}
      {musicDescription && (
        <div className="flex items-center gap-2">
          <strong>Music Description:</strong> {musicDescription}
        </div>
      )}
      {guests && (
        <div className="flex items-center gap-2">
          <strong>Number of Guests:</strong> {guests}
        </div>
      )}
    </div>
  </div>
);
