import * as z from "zod";

export const baseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
});

export const mailchimpFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
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

export const eventTypes = {
  meeting: "Meeting / Workspace",
  birthday: "Birthday / Graduation / Wedding",
};

export const musicTypes = {
  dj: "DJ",
  personal: "Personal device",
  house: "House vinyl",
};

export type FormData = z.infer<typeof baseFormSchema> & {
  name: String;
  email: String;
  phone: String;
  message: String;
  eventDate?: Date;
  eventTime?: string;
  eventType?: string;
  guests?: number;
  musicType?: string;
};

export type FormType = "event" | "dj" | "general";

export type EventFormData = z.infer<typeof eventFormSchema>;

export type MailchimpFormData = z.infer<typeof mailchimpFormSchema>;

export type EventFormProps = {
  onSubmit: (values: EventFormData) => Promise<void>;
};

export type DjFormProps = {
  onSubmit: (values: FormData) => Promise<void>;
};

export type GeneralFormProps = {
  onSubmit: (values: FormData) => Promise<void>;
};

export type EventFormRef = {
  reset: () => void;
};

export type DjFormRef = {
  reset: () => void;
};

export type GeneralFormRef = {
  reset: () => void;
};

export type MailchimpFormRef = {
  reset: () => void;
};
