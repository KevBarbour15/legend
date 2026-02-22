"use client";

import { useRef, useCallback } from "react";
import AudioStatic from "@/components/audio-static/AudioStatic";
import JobApplicationForm from "@/components/contact-forms/JobApplicationForm";
import { useToast } from "@/hooks/use-toast";
import type {
  JobApplicationData,
  JobApplicationFormRef,
} from "@/data/jobApplication";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

const Jobs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<JobApplicationFormRef>(null);
  const { toast } = useToast();

  const handleSubmit = useCallback(
    async (values: JobApplicationData, resumeFile: File) => {
      try {
        const formData = new FormData();
        formData.set("email", values.email);
        formData.set("firstName", values.firstName);
        formData.set("lastName", values.lastName);
        formData.set("phone", values.phone);
        formData.set("hearAbout", values.hearAbout);
        formData.set("whyApply", values.whyApply);
        formData.set("musicGenres", values.musicGenres);
        formData.set("threeAlbums", values.threeAlbums);
        formData.set("barExperience", values.barExperience);
        formData.set("craftBeerWine", values.craftBeerWine);
        formData.set("busyRush", values.busyRush);
        formData.set("difficultFeedback", values.difficultFeedback);
        formData.set("availability", values.availability);
        formData.set("howSoonStart", values.howSoonStart);
        if (values.anythingElse) {
          formData.set("anythingElse", values.anythingElse);
        }
        formData.set("resume", resumeFile);

        const response = await fetch("/api/job-application", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          toast({
            title: "Application submitted!",
            description: "Thanks for applying. We'll be in touch.",
          });
          formRef.current?.reset();
          return;
        }

        const data = await response.json().catch(() => ({}));
        toast({
          title: "Something went wrong",
          description: data.error || "Please try again.",
          variant: "destructive",
        });
      } catch (error) {
        console.error("Failed to submit application:", error);
        toast({
          title: "Failed to submit",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast],
  );

  useGSAP(() => {
    if (!containerRef.current) return;

    const heading = new SplitText("#jobs-heading", { type: "chars" });
    const subheading = new SplitText("#jobs-subheading", { type: "words" });

    const tl = gsap.timeline();
    tl.set("#jobs-heading", { opacity: 1 })
      .set("#jobs-subheading", { opacity: 1 })
      .set(heading.chars, { opacity: 0, y: -25 })
      .set(subheading.words, { x: -25, opacity: 0 })
      .to(heading.chars, {
        duration: 0.35,
        ease: "back.out(1.7)",
        y: 0,
        opacity: 1,
        stagger: 0.015,
      })
      .to(subheading.words, {
        duration: 0.35,
        ease: "back.out(1.7)",
        x: 0,
        opacity: 1,
        stagger: 0.025,
      });
  }, []);

  return (
    <>
      <AudioStatic />
      <div ref={containerRef} className="min-h-screen pt-16 md:pt-0">
        <div className="mx-auto flex flex-col overflow-y-auto px-3 pb-20 md:px-0 md:pb-12 md:pl-[240px] md:pr-6 md:pt-6">
          <div className="overflow-hidden">
            <h2
              id="jobs-heading"
              className="mb-2 mt-3 font-bigola text-4xl text-customGold opacity-0 text-shadow-custom md:hidden"
            >
              Jobs
            </h2>
            <h3
              id="jobs-subheading"
              className="mb-4 w-full font-hypatia text-lg leading-[1.25] text-customNavy opacity-0 text-shadow-custom md:mb-6 md:text-center md:font-bigola md:text-3xl"
            >
              Join the team at Legend Has It
            </h3>
          </div>
          <JobApplicationForm ref={formRef} onSubmit={handleSubmit} />
        </div>
      </div>
    </>
  );
};

export default Jobs;
