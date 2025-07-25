"use client";
import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AudioStatic from "@/components/audio-static/AudioStatic";
import EventForm from "@/components/contact-forms/EventForm";
import GeneralForm from "@/components/contact-forms/GeneralForm";
import DjForm from "@/components/contact-forms/DjForm";

import { useToast } from "@/hooks/use-toast";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

import {
  FormData,
  FormType,
  EventFormRef,
  DjFormRef,
  GeneralFormRef,
} from "@/data/forms.ts";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<FormType>("event");
  const { toast } = useToast();

  const eventFormRef = useRef<EventFormRef>(null);
  const djFormRef = useRef<DjFormRef>(null);
  const generalFormRef = useRef<GeneralFormRef>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const splitText = new SplitText("#heading", { type: "words" });

    const tl = gsap.timeline();
    tl.set(splitText.words, { opacity: 0, x: -25 })
      .set("#heading", { opacity: 1 })
      .to(
        splitText.words,
        {
          duration: 0.35,
          ease: "back.out(1.7)",
          x: 0,
          opacity: 1,
          stagger: 0.025,
        },
        0.15,
      );

    gsap.fromTo(
      "#tabs-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.015 },
    );
  }, []);

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
      <AudioStatic />
      <div ref={containerRef} className="min-h-dvh w-screen pt-16 md:pt-0">
        <div className="mx-auto flex flex-col overflow-y-auto px-3 pb-20 md:px-0 md:pb-10 md:pl-[258px] md:pr-6 md:pt-6">
          <h1
            id="heading"
            className="mt-6 w-full text-pretty font-bigola text-6xl text-customNavy opacity-0 drop-shadow-text md:mt-0 md:text-center md:text-7xl"
          >
            Sound Off - Say Hello!
          </h1>
          <Tabs
            defaultValue="event"
            className="flex w-full flex-col items-center opacity-0"
            onValueChange={(value) => setActiveTab(value as FormType)}
            id="tabs-container"
          >
            <TabsList className="mb-4 mt-6 grid w-full grid-cols-3 font-bigola lg:w-[650px]">
              <TabsTrigger value="event" className="border-customNavy/20">
                Event <span className="md:flex">&nbsp;Inquiry</span>
              </TabsTrigger>
              <TabsTrigger value="dj" className="border-customNavy/20">
                DJ <span className="md:flex">&nbsp;Inquiry</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="border-customNavy/20">
                General <span className="md:flex">&nbsp;Inquiry</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="event"
              className="flex w-full flex-col items-center font-hypatia"
            >
              <EventForm
                ref={eventFormRef}
                onSubmit={(values) => handleSubmit("event", values)}
              />
            </TabsContent>
            <TabsContent
              value="dj"
              className="flex w-full flex-col items-center font-hypatia"
            >
              <DjForm
                onSubmit={(values) => handleSubmit("dj", values)}
                ref={djFormRef}
              />
            </TabsContent>
            <TabsContent
              value="general"
              className="flex w-full flex-col items-center font-hypatia"
            >
              <GeneralForm
                ref={generalFormRef}
                onSubmit={(values) => handleSubmit("general", values)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
