"use client";
import { useRef } from "react";

import ImageCarousel from "@/components/carousel/Carousel";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileMenu from "@/components/mobile-menu/MobileMenu";

import {
  InstagramLogo,
  FacebookLogo,
  YoutubeLogo,
  Key,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import { IconButton } from "@mui/material";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MailchimpFormRef,
  mailchimpFormSchema,
  MailchimpFormData,
} from "@/data/forms";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const mailchimpFormRef = useRef<MailchimpFormRef>(null);

  const form = useForm<MailchimpFormData>({
    resolver: zodResolver(mailchimpFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: MailchimpFormData) => {
    console.log(values);
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
    const sectionsTl = gsap.timeline();

    sectionRefs.forEach((section) => {
      if (!section) return;

      sectionsTl.add(
        gsap.fromTo(
          section,
          {
            y: 35,
            opacity: 0,
          },
          {
            delay: 0.15,
            duration: 1,
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 75%",
              scrub: 1,
            },
          },
        ),
        0,
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
            className="opacity-0 md:aspect-video md:overflow-hidden"
          >
            <img src="/images/about-image.jpg" className="object-cover" />
          </div>

          <div className="font-hypatia text-lg text-customNavy md:text-xl">
            <p id="about-section" className="my-6 opacity-0">
              Welcome to Legend Has It, Sacramento's first hi-fi listening bar,
              where music meets the art of sound. We offer an immersive
              experience for audiophiles and music lovers, celebrating the
              warmth of vinyl records and the richness of high-fidelity sound.
            </p>
            <p id="about-section" className="opacity-0">
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
          <div className="flex flex-col items-center md:flex-row">
            <div className="flex w-full basis-1/2 items-end">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-row gap-3"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-bigola text-customCream">
                          Email
                        </FormLabel>
                        <FormControl className="border border-customGold font-hypatia text-customCream">
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="">Submit</Button>
                </form>
              </Form>
            </div>

            <div className="flex basis-1/2 items-end justify-between font-bigola">
              <IconButton
                className="text-5xl text-customNavy transition-colors md:hover:text-customGold"
                href="https://www.instagram.com/legendhasithifi/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramLogo size={48} weight="fill" />
              </IconButton>

              <IconButton
                className="text-5xl text-customNavy transition-colors md:hover:text-customGold"
                href="https://www.facebook.com/legendhasithifi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookLogo size={48} weight="fill" />
              </IconButton>

              <IconButton
                className="text-5xl text-customNavy transition-colors md:hover:text-customGold"
                href="https://www.youtube.com/@legendhasithifi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <YoutubeLogo size={48} weight="fill" />
              </IconButton>
            </div>
          </div>
          <div className="mt-6 hidden w-full justify-end rounded-full md:flex">
            <Button className="h-fit w-fit border border-transparent bg-customNavy p-1 text-customCream transition-all hover:border-customNavy hover:bg-customCream hover:text-customNavy">
              <LoginLink postLoginRedirectURL="/dashboard">
                <Key weight="regular" size={24} />
              </LoginLink>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
