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
    const tl = useRef<gsap.core.Timeline | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        form.reset();
      },
    }));

    useGSAP(() => {
      if (!formRef.current) return;

      gsap.set("#general-form", {
        opacity: 0,
      });

      tl.current = gsap.timeline({});
      tl.current.to("#general-form", {
        delay: 0.15,
        duration: 0.25,
        opacity: 1,
        ease: "sine.inOut",
      });
    }, []);

    return (
      <Form {...form}>
        <form
          ref={formRef}
          id="general-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-3 md:w-[550px] opacity-0"
        >
          <p className="general-form-field text-pretty font-hypatia text-customCream">
            Thank you for reaching out to Legend Has It. Please take a minute
            and fill out the form below to give us a better understanding of how
            we can help.
          </p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="general-form-field w-full">
                <FormLabel className="font-bigola text-customCream">
                  Name
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="general-form-field w-full">
                <FormLabel className="font-bigola text-customCream">
                  Email
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="general-form-field w-full">
                <FormLabel className="font-bigola text-customCream">
                  Phone
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="general-form-field w-full">
                <FormLabel className="font-bigola text-customCream">
                  Message
                </FormLabel>
                <FormControl className="border border-customGold font-hypatia text-customCream">
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="general-form-field mx-auto w-full rounded-sm border border-customGold bg-transparent p-3 font-bigola text-2xl text-customCream active:bg-customNavy active:text-customCream sm:w-fit md:p-6 md:hover:bg-customCream md:hover:text-customNavy"
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
