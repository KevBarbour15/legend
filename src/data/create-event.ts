import * as z from "zod";

export const formSchema = z.object({
  title: z.string().min(1, "Event name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  tickets_url: z
    .string()
    .url("Invalid tickets URL")
    .optional()
    .or(z.literal("")),
  description: z.string().min(1, "Description is required"),
});
