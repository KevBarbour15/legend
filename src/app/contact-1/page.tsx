"use client";
import { useRef } from "react";

import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  eventDate: z.date({
    required_error: "Preferred date is required",
  }),
  message: z.string().min(1, "Message is required"),
});

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set("#section-heading", {
      opacity: 0,
    });

    gsap.set("#form .form-field", {
      x: "50%",
      opacity: 0,
      rotateX: 45,
    });

    tl.current = gsap
      .timeline({})
      .to("#section-heading", {
        duration: 0.35,
        opacity: 1,
        delay: 0.05,
      })
      .to("#form .form-field", {
        delay: 0.15,
        duration: 0.4,
        stagger: 0.125,
        x: 0,
        opacity: 1,
        rotateX: 0,
      });
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const dateString = values.eventDate.toLocaleDateString();
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          eventDate: dateString,
        }),
      });

      if (response.ok) {
        form.reset();
        await subscribeToMailchimp(
          values.email,
          values.firstName,
          values.lastName,
        );
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const subscribeToMailchimp = async (
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName, lastName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to subscribe to Mailchimp:", errorData.error);
      } else {
        console.log("Subscribed to Mailchimp");
      }
    } catch (error) {
      console.error("Error subscribing to Mailchimp:", error);
    }
  };

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col items-center justify-center overflow-y-auto p-3 pb-20 md:pb-6 md:pl-[250px] md:pr-6 md:pt-6"
      >
        <MobileHeading section={"Let's connect!"} />
        <h2
          id="section-heading"
          className="hidden pb-3 font-bigola text-3xl text-customGold opacity-0 md:block"
        >
          Let's connect!
        </h2>
        <p
          id="section-heading"
          className="py-3 font-hypatia text-xl text-customCream opacity-0 md:pb-3 md:pt-0 md:text-center"
        >
          If you have any questions, ideas, or want to collaborate with us,
          please fill out the form below.
        </p>
        <Form {...form}>
          <form
            id="form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center space-y-6 pb-3 md:pb-6"
          >
            <div className="form-field w-full font-hypatia opacity-0">
              <div className="flex w-full flex-col justify-between space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="form-field w-full opacity-0">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem className="form-field w-full opacity-0">
                  <FormLabel>Preferred date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={(date: Date | undefined) =>
                        field.onChange(date)
                      }
                    />
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
                  <FormLabel>Additional information/ideas</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="form-field rounded-full p-3 font-bigola text-2xl capitalize text-customCream opacity-0 transition-all hover:text-customGold"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
