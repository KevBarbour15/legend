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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  baseFormSchema,
  FormData,
  GeneralFormProps,
  GeneralFormRef,
} from "@/data/forms";

const GeneralForm = forwardRef<GeneralFormRef, GeneralFormProps>(
  ({ onSubmit }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<FormData>({
      resolver: zodResolver(baseFormSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        message: "",
      },
    });
    const { isSubmitting } = form.formState;

    useImperativeHandle(ref, () => ({
      reset: () => {
        form.reset();
      },
    }));

    useGSAP(() => {
      if (!formRef.current) return;

      gsap.fromTo(
        "#general-form",
        {
          opacity: 0,
        },
        {
          delay: 0.35,
          duration: 0.25,
          opacity: 1,
          ease: "sine.inOut",
        },
      );
    }, []);

    return (
      <Form {...form}>
        <form
          ref={formRef}
          id="general-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex w-full flex-col space-y-3 opacity-0 lg:w-[720px]"
        >
          <p className="mb-6 text-pretty font-hypatia text-xl leading-[1.25] text-customNavy text-shadow-custom">
            Thank you for reaching out to{" "}
            <span className="font-bigola">Legend Has It</span>. Please take a
            minute and fill out the form below to give us a better understanding
            of how we can help.
          </p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="general-name"
                    placeholder="Name"
                    aria-label="Your full name"
                    aria-describedby="general-name-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="general-name-description" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="general-email"
                    type="email"
                    placeholder="Email"
                    aria-label="Your email address"
                    aria-describedby="general-email-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="general-email-description" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="general-phone"
                    type="tel"
                    placeholder="Phone"
                    aria-label="Your phone number"
                    aria-describedby="general-phone-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="general-phone-description" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="rounded-sm border border-customNavy/20 bg-customWhite font-hypatia text-customNavy box-shadow-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Textarea
                    id="general-message"
                    placeholder="Message"
                    aria-label="Your message"
                    aria-describedby="general-message-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="general-message-description" />
              </FormItem>
            )}
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
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    );
  },
);

GeneralForm.displayName = "GeneralForm";

export default GeneralForm;
