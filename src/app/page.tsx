"use client";
import { useRef, useState, useEffect } from "react";

import Image from "next/image";

import ImageCarousel from "@/components/carousel/Carousel";
import SideMenu from "@/components/side-menu/SideMenu";
import MobileMenu from "@/components/mobile-menu/MobileMenu";
import AudioStatic from "@/components/audio-static/AudioStatic";

import {
  InstagramLogo,
  FacebookLogo,
  YoutubeLogo,
  Copyright,
  Phone,
  Key,
  TidalLogo,
  SpotifyLogo,
} from "@phosphor-icons/react";

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
  const [yPercent, setYPercent] = useState<number>(-50);
  const [parallaxEnd, setParallaxEnd] = useState<string>("top 15%");
  const form = useForm<MailchimpFormData>({
    resolver: zodResolver(mailchimpFormSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    // Set the yPercent based on the window width for better parrallax
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setYPercent(-50);
        setParallaxEnd("top center");
      } else {
        setYPercent(-25);
        setParallaxEnd("top 15%");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
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

    gsap.set("#about-image", {
      yPercent: yPercent,
    });

    gsap.to("#about-image", {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#about-image",
        start: "top bottom",
        end: parallaxEnd,
        scrub: 1,
      },
    });

    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: "#hidden-bg",
        start: "center center",
        end: "center 10%",
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
          delay: 0.15,
          duration: 0.35,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top-=50 bottom",
            toggleActions: "play none none none",
          },
        },
      );
    });
  }, [yPercent, parallaxEnd]);

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
        <div className="top-bg hidden h-dvh w-screen md:block"></div>
        <div
          id="about-content"
          className="relative mx-auto block h-auto p-3 md:py-6 md:pl-[258px] md:pr-6 xl:max-w-[1280px] xxl:max-w-[1536px]"
        >
          <div className="relative aspect-video overflow-hidden">
            <Image
              id="about-image"
              src="/images/about-image.jpg"
              className="object-cover"
              fill
              alt="Grand Opening"
              priority={true}
              loading="eager"
            />
          </div>

          <div className="font-hypatia text-lg text-customNavy md:text-xl">
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
            id="about-section"
            className="hidden flex-row gap-6 border-b border-customNavy py-6 opacity-0 md:flex"
          >
            <div className="basis-1/2">
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
            <div className="basis-1/2">
              <iframe
                title="Tidal Playlist"
                src="https://embed.tidal.com/playlists/af487a34-0dda-4c35-a02e-44f402c4a141"
                allow="encrypted-media"
                className="h-[352px] w-full rounded-xl"
                loading="lazy"
                height="352"
                width="100%"
              ></iframe>
            </div>
          </div>

          <div
            className="mb-6 flex flex-col-reverse items-center gap-3 opacity-0 md:mt-6 md:flex-row md:gap-0"
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
                        <FormControl className="border border-customNavy font-hypatia text-customNavy backdrop-blur-sm">
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
                <SpotifyLogo size={40} weight="fill" />
              </a>

              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://listen.tidal.com/user/199890881"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on Tidal"
                title="Follow us on Tidal"
              >
                <TidalLogo size={40} weight="fill" />
              </a>

              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://www.instagram.com/legendhasithifi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on Instagram"
                title="Follow us on Instagram"
              >
                <InstagramLogo size={40} weight="fill" />
              </a>

              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://www.facebook.com/legendhasithifi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on Facebook"
                title="Follow us on Facebook"
              >
                <FacebookLogo size={40} weight="fill" />
              </a>

              <a
                className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
                href="https://www.youtube.com/@legendhasithifi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Legend Has It on YouTube"
                title="Follow us on YouTube"
              >
                <YoutubeLogo size={40} weight="fill" />
              </a>
            </div>
          </div>
          <div
            className="mb-16 flex w-full justify-between border-t border-customNavy pt-3 font-bigola text-sm text-customNavy opacity-0 md:mb-0"
            id="about-section"
          >
            <div>
              <a
                href="tel:+19166627942"
                className="flex items-center gap-1 transition-all duration-300 active:text-customGold md:hover:text-customGold"
              >
                <Phone weight="thin" />
                (916) 662-7942
              </a>

              <span className="flex items-center gap-1">
                <Copyright weight="thin" /> 2024 Legend Has It
              </span>
            </div>
            <div className="flex items-end">
              <LoginLink
                postLoginRedirectURL="/dashboard"
                className="flex items-center gap-1 transition-all duration-300 active:text-customGold md:hover:text-customGold"
              >
                Owner Login
                <Key weight="thin" />
              </LoginLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
