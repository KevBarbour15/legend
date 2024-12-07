import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { formSchema } from "@/data/create-event";

const CreateEvent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      "#create-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.15, delay: 0.15, ease: "sine.inOut" },
    );
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
      image_url: "",
      description: "",
      is_photo: true,
    },
  });

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    form.setValue("date", formattedDate);
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.reset();
      } else {
        const errorData = await response.json();
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      id="create-container"
      className="text-black opacity-0"
    >
      <Card className="p-3 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="For ex: Jose's Birthday Party"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_photo"
              render={({ field }) => (
                <FormItem>
                  <div className="text-pretty pr-3 text-sm md:text-base">
                    <FormLabel>Media Type</FormLabel>
                    <FormDescription className="basis-1/2 text-pretty text-sm italic md:text-base">
                      Specify whether photo or video for proper display
                      formatting.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <p>Video</p>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <p>Photo</p>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media URL</FormLabel>
                  <FormDescription className="text-pretty text-sm italic md:text-base">
                    To add image/video, upload to Imgur, right click the media
                    in Imgur and copy media address. For video, convert to video
                    format to MP4 before uploading to Imgur.
                  </FormDescription>

                  <FormControl>
                    <Input placeholder=" Paste media URL here." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional information/ideas here."
                      className="h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateEvent;
