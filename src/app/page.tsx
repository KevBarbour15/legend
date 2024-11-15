"use client";
import { useRef } from "react";

import Image from "next/image";

import ImageCarousel from "@/components/carousel/Carousel";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileMenu from "@/components/mobile-menu/MobileMenu";

import {
  InstagramLogo,
  FacebookLogo,
  YoutubeLogo,
  Key,
} from "@phosphor-icons/react";

import { IconButton } from "@mui/material";
import { Button } from "@/components/ui/button";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mailchimpFormSchema, MailchimpFormData } from "@/data/forms";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const form = useForm<MailchimpFormData>({
    resolver: zodResolver(mailchimpFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: MailchimpFormData) => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      if (response.ok) {
        form.reset();
      } else {
        const errorData = await response.json();
        console.error("Failed to subscribe to Mailchimp:", errorData.error);
      }
    } catch (error) {
      console.error("Error subscribing to Mailchimp:", error);
    }
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    tl.current = gsap.timeline({
      ease: "sine.inOut",
      scrollTrigger: {
        trigger: "#hidden-bg",
        start: "center center",
        end: "center 25%",
        scrub: 1,
      },
    });

    tl.current
      .to(
        ".menu-link",
        {
          color: "#244154",
        },
        0,
      )
      .to(
        ".about-link",
        {
          color: "#bc9952",
        },
        0,
      )
      .to(
        "#menu-text",
        {
          color: "#244154",
        },
        0,
      )
      .to(
        "#hidden-bg",
        {
          opacity: 1,
        },
        0,
      );

    const sectionRefs = document.querySelectorAll("#about-section");
    sectionRefs.forEach((section) => {
      if (!section) return;
      gsap.fromTo(
        section,
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          delay: 0.15,
          duration: 0.35,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            toggleActions: "play none none none",
          },
        },
      );
    });
  }, []);

  return (
    <>
      <SideMenu />
      <MobileMenu />
      <div ref={containerRef} className="block w-screen">
        <div
          id="hidden-bg"
          className="fixed inset-0 z-[-1] h-screen w-screen bg-customCream opacity-0"
        ></div>
        <div className="top-bg hidden h-dvh w-screen md:block"></div>
        <div
          id="about-content"
          className="relative mx-auto block h-auto p-3 md:py-6 md:pl-[258px] md:pr-6 xl:max-w-[1280px] xxl:max-w-[1536px]"
        >
          <div
            id="about-section"
            className="relative aspect-video opacity-0 md:overflow-hidden"
          >
            <Image
              src="/images/about-image.jpg"
              className="object-cover"
              fill
              alt="Grand Opening"
              priority
            />
          </div>

          <div className="font-hypatia text-lg text-customNavy md:text-xl">
            <p id="about-section" className="my-6 text-pretty opacity-0">
              Welcome to Legend Has It, Sacramento's first hi-fi listening bar,
              where music meets the art of sound. We offer an immersive
              experience for audiophiles and music lovers, celebrating the
              warmth of vinyl records and the richness of high-fidelity sound.
            </p>
            <p id="about-section" className="text-pretty opacity-0">
              Our carefully curated sound systems and eclectic vinyl collection
              create an intimate atmosphere, perfect for discovering new tunes
              or revisiting classics. Enjoy from our local craft beer menu
              designed to complement your auditory journey. At Legend Has It,
              music legends come to life, and every visit tells a new story
              through sound.
            </p>
          </div>
          <div className="block py-6 font-bigola text-xl text-customNavy md:mb-0 md:text-3xl">
            <h2 id="about-section" className="mb-3 opacity-0 md:mb-6">
              Hours
            </h2>
            <div
              id="about-section"
              className="mb-3 flex flex-row justify-between opacity-0 md:mb-6"
            >
              <p>Sunday - Tuesday:</p>
              <p>Closed</p>
            </div>
            <div
              id="about-section"
              className="mb-3 flex flex-row justify-between opacity-0 md:mb-6"
            >
              <p>Wednesday - Thursday:</p>
              <p>3pm - 11pm</p>
            </div>
            <div
              id="about-section"
              className="flex flex-row justify-between opacity-0"
            >
              <p>Friday - Saturday:</p>
              <p>3pm - 12am</p>
            </div>
          </div>

          <div id="about-section" className="opacity-0">
            <ImageCarousel />
          </div>

          <div
            className="mb-20 flex flex-col items-center gap-6 opacity-0 md:mb-0 md:mt-12 md:flex-row md:gap-0"
            id="about-section"
          >
            <div className="flex w-full md:basis-1/2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex h-full grow flex-row gap-3 font-hypatia"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl className="border border-customNavy font-hypatia text-customNavy">
                          <Input
                            {...field}
                            placeholder="Enter email to receive updates..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="rounded-sm border border-customNavy bg-transparent font-bigola text-customNavy active:bg-customNavy active:text-customGold sm:w-fit md:hover:bg-customNavy md:hover:italic md:hover:text-customGold"
                  >
                    Subscribe
                  </Button>
                </form>
              </Form>
            </div>
            <div className="flex w-full basis-1/2">
              <div className="flex w-full basis-1/2 justify-start gap-3 font-bigola md:justify-end">
                <IconButton
                  className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                  href="https://www.instagram.com/legendhasithifi/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramLogo size={40} weight="fill" />
                </IconButton>

                <IconButton
                  className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                  href="https://www.facebook.com/legendhasithifi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookLogo size={40} weight="fill" />
                </IconButton>

                <IconButton
                  className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                  href="https://www.youtube.com/@legendhasithifi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YoutubeLogo size={40} weight="fill" />
                </IconButton>
              </div>

              <div
                className="flex w-full basis-1/2 justify-end"
                id="about-section"
              >
                <LoginLink postLoginRedirectURL="/dashboard">
                  <Button className="mx-auto gap-3 rounded-sm border border-customNavy bg-transparent font-bigola text-customNavy active:bg-customNavy active:text-customGold sm:w-fit md:hover:bg-customNavy md:hover:italic md:hover:text-customGold">
                    Owner
                    <Key weight="fill" />
                  </Button>
                </LoginLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
