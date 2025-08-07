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
          className="mx-auto flex w-full flex-col space-y-3 border-t-2 border-customGold pt-4 opacity-0 lg:w-[650px]"
        >
          <p className="text-shadow-custom mb-6 text-pretty font-hypatia text-xl leading-[1.15] text-customNavy md:text-center">
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
                <FormLabel
                  htmlFor="general-name"
                  className="text-shadow-custom font-bigola text-customNavy"
                >
                  Name:
                </FormLabel>
                <FormControl className="rounded-sm border border-customNavy/20 bg-[#f5f5f5] font-hypatia text-customNavy drop-shadow-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="general-name"
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
                <FormLabel
                  htmlFor="general-email"
                  className="text-shadow-custom font-bigola text-customNavy"
                >
                  Email:
                </FormLabel>
                <FormControl className="rounded-sm border border-customNavy/20 bg-[#f5f5f5] font-hypatia text-customNavy drop-shadow-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="general-email"
                    type="email"
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
                <FormLabel
                  htmlFor="general-phone"
                  className="text-shadow-custom font-bigola text-customNavy"
                >
                  Phone:
                </FormLabel>
                <FormControl className="rounded-sm border border-customNavy/20 bg-[#f5f5f5] font-hypatia text-customNavy drop-shadow-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Input
                    id="general-phone"
                    type="tel"
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
                <FormLabel
                  htmlFor="general-message"
                  className="text-shadow-custom font-bigola text-customNavy"
                >
                  Message:
                </FormLabel>
                <FormControl className="rounded-sm border border-customNavy/20 bg-[#f5f5f5] font-hypatia text-customNavy drop-shadow-card focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customGold">
                  <Textarea
                    id="general-message"
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
            className="mx-auto w-fit rounded-lg border border-customNavy/20 bg-customNavy font-bigola text-2xl text-[#f5f5f5] drop-shadow-card transition-all duration-300 ease-in-out md:hover:bg-[#f5f5f5] md:hover:text-customNavy md:active:bg-customGold"
          >
            Submit
          </Button>
        </form>
      </Form>
    );
  },
);

GeneralForm.displayName = "GeneralForm";

export default GeneralForm;
