import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

import { baseFormSchema, FormData } from "@/types/forms";

type GeneralFormProps = {
  onSubmit: (values: FormData) => Promise<void>;
};

export default function GeneralForm({ onSubmit }: GeneralFormProps) {
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

  useGSAP(() => {
    if (!formRef.current) return;

    gsap.set(".form-field", {
      y: "-50",
      opacity: 0,
    });

    gsap.to(".form-field", {
      delay: 0.15,
      duration: 0.25,
      stagger: 0.075,
      y: 0,
      opacity: 1,
    });
  }, []);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-3 md:w-[550px]"
      >
        <p className="form-field text-pretty font-hypatia text-customCream opacity-0">
          Thank you for reaching out to Legend Has It. Please take a minute and
          fill out the form below to give us a better understanding of how we
          can help.
        </p>
        <div className="form-field w-full opacity-0">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
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
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="form-field w-full opacity-0">
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
            <FormItem className="form-field w-full opacity-0">
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
            <FormItem className="form-field w-full opacity-0">
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
          className="form-field mx-auto w-full rounded-lg border border-customGold bg-customNavy p-3 font-bigola text-2xl text-customCream opacity-0 sm:w-fit md:p-6 md:hover:bg-customCream md:hover:text-customNavy"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
