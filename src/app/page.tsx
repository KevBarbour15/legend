"use client";
import { useRef, useEffect } from "react";

import Image from "next/image";

import ImageCarousel from "@/components/carousel/Carousel";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileMenu from "@/components/mobile-menu/MobileMenu";
import AudioStatic from "@/components/audio-static/AudioStatic";

import { Copyright, Phone, Key } from "@phosphor-icons/react";

import { FaYelp, FaYoutube, FaFacebook, FaSpotify } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";

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

  useEffect(() => {
    // Ensure the page is scrolled to the top when the page is loaded and stays there
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";

      // Add event listener to ensure it stays manual
      window.addEventListener("load", () => {
        window.history.scrollRestoration = "manual";
      });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Kill any existing ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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

    // Clear any existing ScrollTrigger instances before creating new ones
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: "#hidden-bg",
        start: "bottom bottom",
        end: "75% top",
        scrub: true,
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
        ".player-button",
        {
          color: "#244154",
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
        "#mobile-menu",
        {
          opacity: 0,
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
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          delay: 0.2,
          duration: 0.5,
          ease: "back.out(1.7)",
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
      <SideMenu color="text-customCream" />
      <MobileMenu />
      <div ref={containerRef} className="block w-screen">
        <div
          id="hidden-bg"
          className="fixed inset-0 z-[-1] h-screen w-screen bg-customCream opacity-0"
        >
          <AudioStatic />
        </div>
        <div className="top-bg h-dvh w-screen"></div>
        <div
          id="about-content"
          className="relative mx-auto block h-auto p-3 md:py-6 md:pl-[258px] md:pr-6 xl:max-w-[1280px] xxl:max-w-[1536px]"
        >
          <div
            id="about-section"
            className="aspect-video w-full overflow-hidden opacity-0"
          >
            <Image
              src="/images/about-image.jpg"
              className="object-cover object-center"
              fill
              alt="Grand Opening"
              priority={true}
              loading="eager"
            />
          </div>

          <div className="font-hypatia text-xl text-customNavy">
            <p
              id="about-section"
              className="my-6 text-pretty leading-[1.15] opacity-0"
            >
              Welcome to Legend Has It, Sacramento's first hi-fi listening bar,
              where music meets the art of sound. We offer an immersive
              experience for audiophiles and music lovers, celebrating the
              warmth of vinyl records and the richness of high-fidelity sound.
            </p>
            <p
              id="about-section"
              className="text-pretty leading-[1.15] opacity-0"
            >
              We curate a space where the ordinary becomes extraordinary. We
              don’t just play sound; we make you feel it. Every beat, every
              conversation, every moment crafted to build something deeper,
              something unforgettable. It’s not about passing the time; it’s
              about engaging with the energy of the room, the people, and the
              music. We foster transformation in the quiet moments and
              connection in the noise. Here, the world slows down, and every
              interaction lingers, leaving you with something that stays with
              you long after the night ends.
            </p>
          </div>
          <div className="mt-3 block py-6 font-bigola text-xl text-customNavy md:mb-0 md:text-3xl">
            <h2 id="about-section" className="mb-3 text-2xl opacity-0 md:mb-6">
              Regular Hours
            </h2>
            <div
              id="about-section"
              className="mb-3 flex flex-row justify-between opacity-0 md:mb-6"
            >
              <p>Monday - Tuesday:</p>
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
              className="mb-3 flex flex-row justify-between opacity-0 md:mb-6"
            >
              <p>Friday - Saturday:</p>
              <p>3pm - 12am</p>
            </div>
            <div
              id="about-section"
              className="mb-3 flex flex-row justify-between opacity-0 md:mb-6"
            >
              <p>Sunday:</p>
              <p>12pm - 5pm</p>
            </div>
            <p
              id="about-section"
              className="mb-3 font-hypatia text-base italic text-customNavy opacity-0"
            >
              * We occasionally open outside of these hours for game days and
              special events. For the most up-to-date info, please check our
              social media pages.
            </p>
          </div>

          <div id="about-section" className="opacity-0">
            <ImageCarousel />
          </div>

          <div
            id="about-section"
            className="hidden pb-6 pt-3 opacity-0 md:block"
          >
            <iframe
              title="Spotify Playlist"
              src="https://open.spotify.com/embed/playlist/7pIFUTsTxa3MMROMuXsElO?utm_source=generator&theme=0"
              width="100%"
              height="352"
              allow="encrypted-media"
              loading="lazy"
              className="h-[352px] w-full rounded-xl"
            ></iframe>
          </div>

          <div
            className="flex flex-col-reverse items-center gap-3 border-t border-customNavy py-3 opacity-0 md:flex-row md:gap-0"
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
                        <FormControl className="truncate border border-customNavy font-hypatia text-customNavy backdrop-blur-sm">
                          <Input
                            {...field}
                            placeholder="Enter email to receive exclusive updates..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="rounded-sm border border-customNavy bg-transparent font-bigola text-customNavy backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-customNavy hover:text-customCream active:bg-customNavy active:text-customCream"
                  >
                    Subscribe
                  </Button>
                </form>
              </Form>
            </div>

            <div className="flex w-full basis-1/2 justify-start gap-3 md:justify-end">
              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://open.spotify.com/user/31pcq2fnwyxprxppy4ezl3v3evaq"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on Spotify"
                title="Follow us on Spotify"
              >
                <FaSpotify size={32} />
              </a>

              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://www.instagram.com/legendhasithifi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on Instagram"
                title="Follow us on Instagram"
              >
                <AiFillInstagram size={32} />
              </a>

              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://www.facebook.com/legendhasithifi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on Facebook"
                title="Follow us on Facebook"
              >
                <FaFacebook size={32} />
              </a>

              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://www.youtube.com/@legendhasithifi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on YouTube"
                title="Follow us on YouTube"
              >
                <FaYoutube size={32} />
              </a>
              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://www.yelp.com/biz/legend-has-it-sacramento"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on Yelp"
                title="Follow us on Yelp"
              >
                <FaYelp size={32} />
              </a>
              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://x.com/legendhasithifi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on X"
                title="Follow us on X"
              >
                <FaXTwitter size={32} />
              </a>
            </div>
          </div>
          <div
            className="mb-16 flex w-full justify-between border-y border-customNavy py-3 font-bigola text-sm text-customNavy opacity-0 md:mb-0"
            id="about-section"
          >
            <div>
              <a
                href="tel:+19166627942"
                className="flex items-center gap-1 transition-all duration-300 active:text-customGold md:hover:text-customGold"
              >
                <Phone weight="regular" />
                (916) 662-7942
              </a>

              <span className="flex items-center gap-1">
                <Copyright weight="regular" /> 2024 Legend Has It
              </span>
            </div>
            <div className="flex items-end">
              <LoginLink
                postLoginRedirectURL="/dashboard"
                className="flex items-center gap-1 transition-all duration-300 active:text-customGold md:hover:text-customGold"
              >
                Owner Login
                <Key weight="regular" />
              </LoginLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
