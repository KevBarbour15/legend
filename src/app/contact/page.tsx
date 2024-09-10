"use client";
import { useEffect, useState, useRef, use } from "react";

import SideMenu from "@/components/side-menu/SideMenu";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Contact() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [howDidYouHear, setHowDidYouHear] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const eventRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!containerRef.current) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      gsap.set(".side-menu", { display: "none" });
    }

    gsap.set("#contact-title", {
      opacity: 0,
      scale: 0.98,
      y: -50,
    });

    gsap.set("#form #input-section", {
      opacity: 0,
      scale: 0.98,
      y: 15,
    });

    tl.current = gsap
      .timeline({})
      .to(
        "#contact-title",
        {
          duration: 0.1,
          opacity: 1,
          scale: 1,
          ease: "linear",
          y: 0,
        },
        0.1,
      )
      .to(
        "#form #input-section",
        {
          duration: 0.15,
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "linear",
          stagger: 0.025,
        },
        0.15,
      );
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !preferredDate ||
      !message
    ) {
      setError("Please fill out all fields.");
      return;
    }

    console.log("Made it to here");

    setError("");

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          preferredDate: preferredDate,
          budget: budget,
          howDidYouHear: howDidYouHear,
          message: message,
        }),
      });

      if (response.ok) {
        console.log("Message sent successfully.");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPreferredDate("");
        setBudget("");
        setHowDidYouHear("");
        setMessage("");
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.log("Error: ", error);
      setError("Failed to submit form.");
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setPreferredDate(formattedDate);
  }, []);

  return (
    <>
      <SideMenu />
      <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-md"></div>
      <div
        ref={containerRef}
        className="z-10 flex w-screen flex-col p-6 md:items-center md:px-[260px] md:py-6"
      >
        <div className="z-10 mb-3 border-b-2 border-customCream pb-3 text-3xl text-customCream md:hidden">
          <Link href={"/"}>
            <ArrowBackIcon className="mr-6" />
            <span className="font-bigola">Let's Connect</span>
          </Link>
        </div>
        <h1 className="mb-3 hidden font-bigola text-4xl text-customCream md:flex lg:text-5xl">
          Let's Connect
        </h1>
        <p className="font-hypatia text-lg text-customCream">
          Fill out the form below and we will reach out to you.
        </p>
        <form
          id="form"
          className="tw-bg-customBlack flex flex-col items-center py-6"
          onSubmit={handleSubmit}
        >
          <div id="input-section" className="mb-3 font-hypatia opacity-0">
            <div className="flex w-90vw flex-col justify-between text-2xl sm:flex-row lg:w-50vw xl:w-45vw xxl:w-40vw">
              <input
                className="flex-1 border-b-2 border-customCream border-opacity-50 bg-transparent text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none sm:mr-1"
                type="text"
                placeholder="First Name"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="mt-3 flex-1 border-b-2 border-customCream border-opacity-50 bg-transparent text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none sm:ml-1 sm:mt-0"
                type="text"
                placeholder="Last Name"
                value={lastName}
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div id="input-section" className="my-3 opacity-0">
            <input
              className="w-90vw border-b-2 border-customCream border-opacity-50 bg-transparent font-hypatia text-2xl text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div id="input-section" className="my-3 opacity-0">
            <input
              className="w-90vw border-b-2 border-customCream border-opacity-50 bg-transparent font-hypatia text-2xl text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              placeholder="Phone Number"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div id="input-section" className="my-3 opacity-0">
            <input
              className="w-90vw border-b-2 border-customCream border-opacity-50 bg-transparent font-hypatia text-2xl text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="date"
              value={preferredDate}
              placeholder="Select a date"
              required
              onChange={(e) => setPreferredDate(e.target.value)}
            />
          </div>
          <div id="input-section" className="my-3 opacity-0">
            <textarea
              className="h-52 w-90vw border-b-2 border-customCream border-opacity-50 bg-transparent font-hypatia text-2xl text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              placeholder="Add any additional information/ideas here."
              value={message}
              required
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            id="input-section"
            className="menu-link mt-3 font-bigola text-2xl leading-none tracking-wider text-customCream opacity-0"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </>
  );
}
