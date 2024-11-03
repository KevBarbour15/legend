import * as z from "zod";

export const formSchema = z.object({
  title: z.string().min(1, "Event name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  image_url: z.string().url("Invalid URL"),
  description: z.string().min(1, "Description is required"),
  is_photo: z.boolean(),
});
