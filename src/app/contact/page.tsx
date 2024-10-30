"use client";
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";
import EventForm from "@/components/contact-forms/EventForm";
import GeneralForm from "@/components/contact-forms/GeneralForm";
import DjForm from "@/components/contact-forms/DjForm";

import { useToast } from "@/hooks/use-toast";

import {
  FormData,
  FormType,
  EventFormRef,
  DjFormRef,
  GeneralFormRef,
} from "@/types/forms.ts";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<FormType>("event");
  const { toast } = useToast();

  const eventFormRef = useRef<EventFormRef>(null);
  const djFormRef = useRef<DjFormRef>(null);
  const generalFormRef = useRef<GeneralFormRef>(null);

  const handleSubmit = async (formType: FormType, values: FormData) => {
    try {
      const processedValues = {
        ...values,
        eventDate: values.eventDate?.toLocaleDateString(),
      };

      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...processedValues,
          formType: formType,
        }),
      });

      if (response.ok) {
        toast({
          title: "Thank you for reaching out!",
          description: "We'll get back to you soon.",
        });

        await subscribeToMailchimp(values.email, values.name);

        switch (formType) {
          case "event":
            eventFormRef.current?.reset();
            break;
          case "dj":
            djFormRef.current?.reset();
            break;
          case "general":
            generalFormRef.current?.reset();
            break;
        }
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast({
        title: "Failed to submit form.",
        description: "Please try again.",
      });
    }
  };

  const subscribeToMailchimp = async (email: string, name: string) => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to subscribe to Mailchimp:", errorData.error);
      }
    } catch (error) {
      console.error("Error subscribing to Mailchimp:", error);
    }
  };

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-full min-h-screen w-screen backdrop-blur-sm"></div>
      <div
        ref={containerRef}
        className="z-10 mx-auto flex w-screen flex-col items-center justify-center overflow-y-auto p-3 pb-20 md:pb-6 md:pl-[258px] md:pr-6 md:pt-6 xl:max-w-[1280px] xxl:max-w-[1536px]"
      >
        <MobileHeading section={"Contact"} />
        <Tabs
          defaultValue="event"
          className="flex w-full flex-col items-center"
          onValueChange={(value) => setActiveTab(value as FormType)}
        >
          <TabsList className="my-3 grid w-full grid-cols-3 bg-transparent font-bigola md:mb-6 md:mt-0 md:w-fit">
            <TabsTrigger value="event">
              Event <span className="md:flex">&nbsp;Inquiry</span>
            </TabsTrigger>
            <TabsTrigger value="dj">
              DJ <span className="md:flex">&nbsp;Inquiry</span>
            </TabsTrigger>
            <TabsTrigger value="general">
              General <span className="md:flex">&nbsp;Inquiry</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="event"
            className="flex w-full flex-col items-center"
          >
            <EventForm
              ref={eventFormRef}
              onSubmit={(values) => handleSubmit("event", values)}
            />
          </TabsContent>
          <TabsContent value="dj" className="flex w-full flex-col items-center">
            <DjForm
              onSubmit={(values) => handleSubmit("dj", values)}
              ref={djFormRef}
            />
          </TabsContent>
          <TabsContent
            value="general"
            className="flex w-full flex-col items-center"
          >
            <GeneralForm
              ref={generalFormRef}
              onSubmit={(values) => handleSubmit("general", values)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
