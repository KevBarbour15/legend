"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  jobApplicationSchema,
  JobApplicationData,
  JobApplicationFormProps,
  JobApplicationFormRef,
  howSoonStartOptions,
} from "@/data/jobApplication";

const inputClassName =
  "rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold";
const textareaClassName =
  "min-h-[100px] rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold";
const fileUploadClassName =
  "flex min-h-[80px] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-customNavy/30 bg-customWhite/50 font-hypatia text-customNavy transition-colors duration-200 hover:border-customGold/50 hover:bg-customWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-customGold focus-visible:ring-offset-2";

const JobApplicationForm = forwardRef<
  JobApplicationFormRef,
  JobApplicationFormProps
>(({ onSubmit }, ref) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm<JobApplicationData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      hearAbout: "",
      whyApply: "",
      musicGenres: "",
      threeAlbums: "",
      barExperience: "",
      craftBeerWine: "",
      busyRush: "",
      difficultFeedback: "",
      availability: "",
      howSoonStart: undefined,
      anythingElse: "",
      resume: undefined as unknown as FileList,
    },
  });
  const { isSubmitting } = form.formState;

  useImperativeHandle(ref, () => ({
    reset: () => form.reset(),
  }));

  useGSAP(() => {
    if (!formRef.current) return;
    gsap.fromTo(
      "#job-application-form",
      { opacity: 0 },
      { delay: 0.35, duration: 0.25, opacity: 1, ease: "sine.inOut" },
    );
  }, []);

  const handleSubmit = form.handleSubmit(async (values) => {
    const file = values.resume?.[0];
    if (!file) return;
    await onSubmit(values, file);
  });

  return (
    <Form {...form}>
      <form
        ref={formRef}
        id="job-application-form"
        onSubmit={handleSubmit}
        className="mx-auto flex w-full flex-col space-y-4 text-pretty opacity-0 lg:max-w-[720px]"
      >
        <div className="mb-6 space-y-3 text-pretty font-hypatia text-xl leading-[1.25] text-customNavy text-shadow-custom">
          <p>
            We&apos;re looking for experienced bar staff who move with urgency,
            take ownership, and genuinely enjoy working as part of a small,
            close-knit team.
          </p>
          <p>
            Great hospitality matters here. We care about creating a space where
            guests feel welcomed, comfortable, and engaged, not rushed through a
            transaction.
          </p>
          <p>
            Familiarity with craft beer and natural wine is a plus, but
            curiosity and a willingness to learn are essential.
          </p>
          <p>
            Music is central to what we do.{" "}
            <span className="font-bigola">Legend Has It</span> is a
            vinyl-focused listening bar, and staff are responsible for curating
            a thoughtful, vibe-forward atmosphere throughout their shift. We
            value curiosity and range when it comes to music, and our
            programming spans genres, eras, and moods. This role is best suited
            for someone who enjoys engaging with music beyond a single genre or
            trend.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-hypatia text-customNavy">
                  First name{" "}
                  <span aria-hidden className="text-customGold">
                    *
                  </span>
                </FormLabel>
                <FormControl className={inputClassName}>
                  <Input
                    placeholder="First name"
                    aria-label="First name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-hypatia text-customNavy">
                  Last name{" "}
                  <span aria-hidden className="text-customGold">
                    *
                  </span>
                </FormLabel>
                <FormControl className={inputClassName}>
                  <Input
                    placeholder="Last name"
                    aria-label="Last name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                Email{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={inputClassName}>
                <Input
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                Phone number{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={inputClassName}>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  aria-label="Phone number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hearAbout"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                How did you hear about Legend Has It?{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="How did you hear about us?"
                  aria-label="How did you hear about Legend Has It"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whyApply"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                What made you want to apply here specifically?{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="What made you want to apply here?"
                  aria-label="What made you want to apply here specifically"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="musicGenres"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                What are a few different genres or eras of music you regularly
                listen to or are curious about?{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="Genres or eras of music..."
                  aria-label="Music genres or eras"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="threeAlbums"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                You&apos;re in charge of playing records behind the bar. What 3
                albums are you picking?{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="Your 3 albums..."
                  aria-label="3 albums you'd play behind the bar"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="barExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                Tell us about your bar or restaurant experience. What kind of
                places have you worked in, and what were you responsible for
                during a typical shift?{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="Bar or restaurant experience..."
                  aria-label="Bar or restaurant experience"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="craftBeerWine"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                What is your experience with craft beer and/or natural wine?{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="Craft beer and/or natural wine experience..."
                  aria-label="Experience with craft beer and natural wine"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="busyRush"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                Tell us about a time you worked through a busy rush. What was
                happening, what was your role, and how did you stay organized
                and calm?{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="A busy rush experience..."
                  aria-label="Time you worked through a busy rush"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficultFeedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                Describe a time you received feedback that was difficult to
                hear. How did you respond in the moment, and what changed
                afterward?{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="Difficult feedback experience..."
                  aria-label="Time you received difficult feedback"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                What does your current availability look like? Please include
                specific days, times, and any ongoing or upcoming scheduling
                limitations.{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="Days, times, and any limitations..."
                  aria-label="Current availability"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="howSoonStart"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                How soon are you looking to start?{" "}
                <span aria-hidden className="text-customGold">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  className="grid gap-2"
                >
                  {howSoonStartOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 font-hypatia text-customNavy"
                    >
                      <RadioGroupItem value={option.value} />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anythingElse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hypatia text-customNavy">
                Anything else you&apos;d like to share?
              </FormLabel>
              <FormControl className={textareaClassName}>
                <Textarea
                  placeholder="Optional"
                  aria-label="Anything else to share"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resume"
          render={({ field: { onChange, value, ...field } }) => {
            const file = value?.[0];
            const fileName = file?.name;
            return (
              <FormItem>
                <FormLabel className="font-hypatia text-customNavy">
                  Please submit your resume (PDF only){" "}
                  <span aria-hidden className="text-customGold">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <div
                    role="button"
                    tabIndex={0}
                    className={fileUploadClassName}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <input
                      {...field}
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      className="sr-only"
                      aria-label="Upload resume (PDF)"
                      onChange={(e) => onChange(e.target.files)}
                    />
                    {fileName ? (
                      <>
                        <span className="text-sm font-medium">{fileName}</span>
                        <span className="text-xs text-customNavy/70">
                          Click to choose a different file
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium">Choose PDF</span>
                        <span className="text-xs text-customNavy/70">
                          Max 10 MB
                        </span>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto w-full rounded-sm border border-customNavy/20 bg-customNavy font-bigola text-customWhite transition-all duration-300 ease-in-out box-shadow-text sm:w-fit md:hover:bg-customWhite md:hover:text-customNavy md:active:bg-customGold disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Submitting application...
            </>
          ) : (
            "Submit application"
          )}
        </Button>
      </form>
    </Form>
  );
});

JobApplicationForm.displayName = "JobApplicationForm";

export default JobApplicationForm;
