import * as z from "zod";

export const baseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
});

export const eventFormSchema = baseFormSchema.extend({
  eventDate: z.date({
    required_error: "Date of event is required",
  }),
  eventTime: z.string().min(1, "Time of event is required"),
  eventType: z.enum(["meeting", "birthday"], {
    required_error: "Please select an event type",
  }),
  guests: z.number().int().min(1, "Number of guests is required"),
  musicType: z.enum(["dj", "personal", "house"], {
    required_error: "Please select a music type",
  }),
});

export const generalFormSchema = baseFormSchema;

export type FormData = z.infer<typeof baseFormSchema> & {
  eventDate?: Date;
  eventTime?: string;
  eventType?: string;
  guests?: number;
  musicType?: string;
};

export type FormType = "event" | "dj" | "general";

export type EventFormData = z.infer<typeof eventFormSchema>;
