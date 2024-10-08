"use client";
import { useState, useRef } from "react";

import { ContactForm } from "@/types";

import SideMenu from "@/components/side-menu/SideMenu";
import MobileHeading from "@/components/mobile-heading/MobileHeading";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import customTheme from "@/app/customTheme";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const initialForm: ContactForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  howDidYouHear: "",
  preferredDate: null,
  message: "",
  error: "",
};

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const outerTheme = useTheme();

  const [contactForm, setContactForm] = useState<ContactForm>(initialForm);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set("#form #input-section", {
      x: "75%",
      opacity: 0,
    });

    tl.current = gsap.timeline({}).to("#form #input-section", {
      delay: 0.15,
      duration: 0.35,
      stagger: 0.075,
      x: 0,
      opacity: 1,
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !contactForm.firstName ||
      !contactForm.lastName ||
      !contactForm.email ||
      !contactForm.phone ||
      !contactForm.preferredDate ||
      !contactForm.message
    ) {
      setContactForm({ ...contactForm, error: "Please fill out all fields." });
      return;
    }
    setContactForm({ ...contactForm, error: "" });

    try {
      const dateString = contactForm.preferredDate.toLocaleDateString();
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: contactForm.firstName,
          lastName: contactForm.lastName,
          email: contactForm.email,
          phone: contactForm.phone,
          preferredDate: dateString,
          howDidYouHear: contactForm.howDidYouHear,
          message: contactForm.message,
        }),
      });

      if (response.ok) {
        setContactForm(initialForm);

        await subscribeToMailchimp(
          contactForm.email,
          contactForm.firstName,
          contactForm.lastName,
        );
      } else {
        const errorData = await response.json();
        setContactForm({ ...contactForm, error: errorData.error });
      }
    } catch (error) {
      setContactForm({ ...contactForm, error: "Failed to submit form." });
    }
  };

  const subscribeToMailchimp = async (
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName, lastName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to subscribe to Mailchimp:", errorData.error);
      } else {
        console.log("Subscribed to Mailchimp");
      }
    } catch (error) {
      console.error("Error subscribing to Mailchimp:", error);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SideMenu />
        <div className="fixed left-0 top-0 z-[-1] h-screen w-screen backdrop-blur-sm"></div>
        <div
          ref={containerRef}
          className="z-10 flex w-screen flex-col items-center justify-center p-3 pb-20 md:pb-6 md:pl-[250px] md:pr-6 md:pt-6"
        >
          <MobileHeading section={"Let's connect"} />
          <ThemeProvider theme={customTheme(outerTheme)}>
            <Box
              component="form"
              id="form"
              className="flex w-full flex-col items-center py-3 md:pb-6"
              onSubmit={handleSubmit}
            >
              <div id="input-section" className="w-full font-hypatia opacity-0">
                <div className="flex w-full flex-col justify-between sm:flex-row">
                  <TextField
                    className="mb-3 flex-1 sm:mr-3 md:my-3"
                    type="text"
                    label="First name"
                    value={contactForm.firstName}
                    required
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        firstName: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                  <TextField
                    className="my-3 flex-1"
                    type="text"
                    label="Last name"
                    value={contactForm.lastName}
                    required
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        lastName: e.target.value,
                      })
                    }
                    variant="standard"
                  />
                </div>
              </div>
              <div id="input-section" className="my-3 w-full opacity-0">
                <TextField
                  className="w-full"
                  type="email"
                  label="Email"
                  value={contactForm.email}
                  required
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  variant="standard"
                />
              </div>
              <div id="input-section" className="my-3 w-full opacity-0">
                <TextField
                  className="w-full"
                  type="tel"
                  label="Phone"
                  value={contactForm.phone}
                  required
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  variant="standard"
                />
              </div>
              <div id="input-section" className="my-3 w-full opacity-0">
                <DatePicker
                  value={contactForm.preferredDate}
                  label="Preferred date *"
                  onChange={(newValue) =>
                    setContactForm({
                      ...contactForm,
                      preferredDate: newValue,
                    })
                  }
                  slotProps={{ textField: { variant: "standard" } }}
                  className="w-full"
                />
              </div>
              <div id="input-section" className="my-3 w-full opacity-0">
                <TextField
                  className="w-full"
                  label="Add any additional information/ideas here."
                  value={contactForm.message}
                  required
                  rows={4}
                  multiline
                  variant="standard"
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                />
              </div>
              <div id="input-section" className="w-full text-center opacity-0">
                <Button
                  type="submit"
                  className="rounded-full p-3 font-bigola text-2xl capitalize text-customCream transition-all hover:text-customGold"
                >
                  Submit
                </Button>
              </div>
            </Box>
          </ThemeProvider>
        </div>
      </LocalizationProvider>
    </>
  );
}
