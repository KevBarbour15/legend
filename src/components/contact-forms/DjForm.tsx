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

import { baseFormSchema, FormData, DjFormProps, DjFormRef } from "@/data/forms";

const DjForm = forwardRef<DjFormRef, DjFormProps>(({ onSubmit }, ref) => {
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
  const tl = useRef<gsap.core.Timeline | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      form.reset();
    },
  }));

  useGSAP(() => {
    if (!formRef.current) return;

    gsap.fromTo(
      "#dj-form",
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
        id="dj-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full flex-col space-y-3 border-t-2 border-customGold pt-4 opacity-0 lg:w-[650px]"
      >
        <p className="mb-6 text-pretty font-hypatia text-xl leading-[1.15] text-customNavy drop-shadow-text md:text-center">
          Thank you for your interest to DJ at{" "}
          <span className="font-bigola">Legend Has It</span>. Please take a
          minute to fill out the form below so we can get to know you and your
          style. Below, please provide as much detail as possible in regard to
          your music style/genre(s), past experience, etc.
        </p>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel
                htmlFor="dj-name"
                className="font-bigola text-customNavy drop-shadow-text"
              >
                Name:
              </FormLabel>
              <FormControl className="rounded-md border border-customNavy/20 bg-[#f5f5f5] font-hypatia text-customNavy drop-shadow-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                <Input
                  id="dj-name"
                  aria-label="Your full name"
                  aria-describedby="dj-name-description"
                  {...field}
                />
              </FormControl>
              <FormMessage id="dj-name-description" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel
                htmlFor="dj-email"
                className="font-bigola text-customNavy drop-shadow-text"
              >
                Email:
              </FormLabel>
              <FormControl className="rounded-md border border-customNavy/20 bg-[#f5f5f5] font-hypatia text-customNavy drop-shadow-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                <Input
                  id="dj-email"
                  type="email"
                  aria-label="Your email address"
                  aria-describedby="dj-email-description"
                  {...field}
                />
              </FormControl>
              <FormMessage id="dj-email-description" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel
                htmlFor="dj-phone"
                className="font-bigola text-customNavy drop-shadow-text"
              >
                Phone:
              </FormLabel>
              <FormControl className="rounded-md border border-customNavy/20 bg-[#f5f5f5] font-hypatia text-customNavy drop-shadow-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                <Input
                  id="dj-phone"
                  type="tel"
                  aria-label="Your phone number"
                  aria-describedby="dj-phone-description"
                  {...field}
                />
              </FormControl>
              <FormMessage id="dj-phone-description" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel
                htmlFor="dj-message"
                className="font-bigola text-customNavy drop-shadow-text"
              >
                Experience, style, etc:
              </FormLabel>
              <FormControl className="rounded-md border border-customNavy/20 bg-[#f5f5f5] font-hypatia text-customNavy drop-shadow-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                <Textarea
                  id="dj-message"
                  aria-label="Your DJ experience and music style"
                  aria-describedby="dj-message-description"
                  {...field}
                />
              </FormControl>
              <FormMessage id="dj-message-description" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mx-auto w-fit rounded-lg border border-customNavy/20 bg-customNavy font-bigola text-2xl text-[#f5f5f5] drop-shadow-card transition-all duration-300 ease-in-out md:hover:bg-[#f5f5f5] md:hover:text-customNavy md:active:bg-customGold"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
});

DjForm.displayName = "DjForm";

export default DjForm;
