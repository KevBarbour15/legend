import * as z from "zod";

export const jobApplicationSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  hearAbout: z.string().min(1, "Please tell us how you heard about us"),
  whyApply: z.string().min(1, "Please tell us what made you want to apply"),
  musicGenres: z.string().min(1, "Please share genres or eras of music you enjoy"),
  threeAlbums: z.string().min(1, "Please pick 3 albums you'd play behind the bar"),
  barExperience: z.string().min(1, "Please describe your bar or restaurant experience"),
  craftBeerWine: z.string().min(1, "Please describe your experience with craft beer and/or natural wine"),
  busyRush: z.string().min(1, "Please describe a time you worked through a busy rush"),
  difficultFeedback: z.string().min(1, "Please describe a time you received difficult feedback"),
  availability: z.string().min(1, "Please describe your current availability"),
  howSoonStart: z.enum(
    ["asap", "within_2_weeks", "next_month", "just_exploring"],
    { required_error: "Please select when you're looking to start" }
  ),
  anythingElse: z.string().optional(),
  resume: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Resume (PDF) is required")
    .refine(
      (files) => files?.[0]?.type === "application/pdf",
      "Only PDF files are accepted"
    ),
});

export const howSoonStartOptions = [
  { value: "asap", label: "ASAP" },
  { value: "within_2_weeks", label: "Within 2 weeks" },
  { value: "next_month", label: "Next month" },
  { value: "just_exploring", label: "Just exploring for now" },
] as const;

export type JobApplicationData = z.infer<typeof jobApplicationSchema>;

export type JobApplicationListItem = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
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
  submittedAt: string;
  viewed: boolean;
  contacted: boolean;
};

export type JobApplicationFormProps = {
  onSubmit: (values: JobApplicationData, resumeFile: File) => Promise<void>;
};

export type JobApplicationFormRef = {
  reset: () => void;
};
