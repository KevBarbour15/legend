"use client";

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

const Footer = () => {
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

  return (
    <footer className="mx-auto w-full py-6 md:pl-[258px] md:pr-6 xl:max-w-[1280px] xxl:max-w-[1536px]">
      <div
        className="flex flex-col-reverse items-center gap-3 pb-3 md:flex-row md:gap-0"
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
            <SpotifyLogo size={40} weight="regular" />
          </a>

          <a
            className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
            href="https://listen.tidal.com/user/199890881"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Legend Has It on Tidal"
            title="Follow us on Tidal"
          >
            <TidalLogo size={40} weight="regular" />
          </a>

          <a
            className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
            href="https://www.instagram.com/legendhasithifi/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Legend Has It on Instagram"
            title="Follow us on Instagram"
          >
            <InstagramLogo size={40} weight="regular" />
          </a>

          <a
            className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
            href="https://www.facebook.com/legendhasithifi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Legend Has It on Facebook"
            title="Follow us on Facebook"
          >
            <FacebookLogo size={40} weight="regular" />
          </a>

          <a
            className="p-0 text-customNavy transition-all duration-300 md:hover:rotate-[360deg] md:hover:text-customGold"
            href="https://www.youtube.com/@legendhasithifi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Legend Has It on YouTube"
            title="Follow us on YouTube"
          >
            <YoutubeLogo size={40} weight="regular" />
          </a>
        </div>
      </div>
      <div
        className="mb-16 flex w-full justify-between border-t border-customNavy pt-3 font-bigola text-sm text-customNavy md:mb-0"
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
    </footer>
  );
};

export default Footer;
