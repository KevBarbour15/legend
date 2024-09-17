"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import SideMenu from "@/components/side-menu/SideMenu";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import customTheme from "@/app/customTheme";
import { ThemeProvider, useTheme } from "@mui/material/styles";

export default function Contact() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [budget, setBudget] = useState<string>("");
  const [howDidYouHear, setHowDidYouHear] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const eventRefs = useRef<HTMLDivElement[]>([]);
  const outerTheme = useTheme();

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set("#contact-heading", {
      opacity: 0,
      y: -15,
    });

    gsap.set("#contact-subheading", {
      opacity: 0,
      y: -15,
    });

    gsap.set("#form #input-section", {
      opacity: 0,
      y: 15,
    });

    tl.current = gsap
      .timeline({})
      .to(
        "#contact-heading",
        {
          duration: 0.15,
          opacity: 1,
          ease: "sine.inOut",
          y: 0,
        },
        0.05,
      )
      .to(
        "#contact-subheading",
        {
          duration: 0.15,
          opacity: 1,
          ease: "sine.inOut",
          y: 0,
        },
        0.15,
      )
      .to(
        "#form #input-section",
        {
          duration: 0.15,
          opacity: 1,
          y: 0,
          ease: "sine.inOut",
          stagger: 0.025,
        },
        0.3,
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
    setError("");

    try {
      const dateString = preferredDate.toLocaleDateString();
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
          preferredDate: dateString,
          budget: budget,
          howDidYouHear: howDidYouHear,
          message: message,
        }),
      });

      if (response.ok) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPreferredDate(null);
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

  const handleAboutScroll = async (e: React.MouseEvent) => {
    e.preventDefault();

    await router.push("/");
    setTimeout(() => {
      const aboutSection = document.getElementById("about-section");

      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SideMenu />
        <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-lg"></div>
        <div
          ref={containerRef}
          className="z-10 flex w-screen flex-col items-center pb-12 pt-3 md:px-[260px] md:pt-6"
        >
          <div
            id="contact-heading"
            className="w-[90vw] border-b-2 border-customCream pb-3 text-3xl text-customCream opacity-0 md:hidden"
          >
            <div>
              <Button onClick={handleAboutScroll}>
                <ArrowBackIos className="mr-6 text-customCream" />
                <span className="font-bigola text-customCream">
                  Let's Connect
                </span>
              </Button>
            </div>
          </div>
          <h2
            id="contact-heading"
            className="hidden font-bigola text-4xl text-customCream opacity-0 md:flex lg:text-5xl"
          >
            Let's Connect
          </h2>
          <p
            id="contact-subheading"
            className="mt-3 text-center font-hypatia text-lg text-customCream opacity-0 md:mt-6"
          >
            Fill out the form below and we will reach out to you.
          </p>
          <ThemeProvider theme={customTheme(outerTheme)}>
            <Box
              component="form"
              id="form"
              className="flex flex-col items-center py-3 md:py-6"
              onSubmit={handleSubmit}
            >
              <div id="input-section" className="mb-3 font-hypatia opacity-0">
                <div className="flex w-90vw flex-col justify-between text-2xl sm:flex-row lg:w-50vw xl:w-45vw xxl:w-40vw">
                  <TextField
                    className="flex-1 sm:mr-1"
                    type="text"
                    label="First Name"
                    value={firstName}
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="standard"
                  />
                  <TextField
                    className="mt-3 flex-1 sm:ml-1 sm:mt-0"
                    type="text"
                    label="Last Name"
                    value={lastName}
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    variant="standard"
                  />
                </div>
              </div>
              <div id="input-section" className="my-3 opacity-0">
                <TextField
                  className="w-90vw lg:w-50vw xl:w-45vw xxl:w-40vw"
                  type="email"
                  label="Email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  variant="standard"
                />
              </div>
              <div id="input-section" className="my-3 opacity-0">
                <TextField
                  className="w-90vw lg:w-50vw xl:w-45vw xxl:w-40vw"
                  type="tel"
                  label="Phone"
                  value={phone}
                  required
                  onChange={(e) => setPhone(e.target.value)}
                  variant="standard"
                />
              </div>
              <div id="input-section" className="my-3 opacity-0">
                <DatePicker
                  value={preferredDate}
                  label="Preferred Date *"
                  onChange={(newValue) => setPreferredDate(newValue)}
                  slotProps={{ textField: { variant: "standard" } }}
                  className="w-90vw lg:w-50vw xl:w-45vw xxl:w-40vw"
                />
              </div>
              <div id="input-section" className="my-3 opacity-0">
                <TextField
                  className="w-90vw lg:w-50vw xl:w-45vw xxl:w-40vw"
                  label="Add any additional information/ideas here."
                  value={message}
                  required
                  rows={4}
                  multiline
                  variant="standard"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button
                id="input-section"
                type="submit"
                className="menu-link rounded-full p-3 font-bigola text-2xl capitalize text-customCream opacity-0"
              >
                Submit
              </Button>
            </Box>
          </ThemeProvider>
        </div>
      </LocalizationProvider>
    </>
  );
}
