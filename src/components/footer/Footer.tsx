"use client";

import { Copyright, Phone, Key } from "@phosphor-icons/react";

import { FaYelp, FaYoutube, FaFacebook, FaSpotify } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import MailchimpForm from "@/components/mailchimp-form/MailchimpForm";

const Footer = () => {
  return (
    <footer className="shadow-top rounded-t-md border-x border-t border-customNavy/20 bg-[#f5f5f5]/25 p-3 pt-6 backdrop-blur-[1px] md:p-6">
      <div className="flex flex-col-reverse items-center gap-6 lg:flex-row lg:gap-0">
        <div className="flex w-full md:basis-1/2">
          <MailchimpForm setShouldShow={() => {}} />
        </div>

        <div className="flex w-full basis-1/2 justify-start gap-6 md:justify-end">
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
      <div className="mb-16 mt-6 flex w-full justify-between font-bigola text-sm text-customNavy md:mb-0">
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
