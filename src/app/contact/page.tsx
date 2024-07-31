"use client";
import { useEffect, useState, useRef, use } from "react";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set("#contact-title", {
      opacity: 0,
      scale: 0.75,
    });

    gsap.set("#form #input-section", {
      opacity: 0,
      scale: 0.95,
      y: 50,
    });

    tl.current = gsap
      .timeline({})
      .to(
        "#contact-title",
        {
          duration: 0.35,
          opacity: 1,
          scale: 1,
          ease: "linear",
        },
        0.35,
      )
      .to(
        "#form #input-section",
        {
          duration: 0.35,
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power1.inOut",
          stagger: 0.1,
        },
        0.7,
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
      !budget ||
      !howDidYouHear ||
      !message
    ) {
      setError("Please fill out all fields.");
      return;
    }

    console.log("Made it to here");

    setError("");

    try {
      const response = await fetch(`/api/message?action=${"createMessage"}`, {
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
    <div
      ref={containerRef}
      className="flex w-screen flex-col justify-center pt-135"
    >
      <h2
        id="contact-title"
        className="my-6 text-center font-bigola text-4xl text-customCream opacity-0 lg:text-5xl"
      >
        Let's Work Together
      </h2>
      <div>
        <form
          id="form"
          className="flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div id="input-section" className="my-2.5 opacity-0">
            <label className="flex text-left font-hypatia text-xl">Name:</label>
            <div className="flex w-85vw flex-col justify-between sm:flex-row lg:w-50vw xl:w-45vw xxl:w-40vw">
              <input
                className="flex-1 rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none sm:mr-1"
                type="text"
                placeholder="First Name"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="mt-2.5 flex-1 rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none sm:ml-1 sm:mt-0"
                type="text"
                placeholder="Last Name"
                value={lastName}
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div id="input-section" className="my-2.5 opacity-0">
            <label className="flex text-left font-hypatia text-xl">
              Email:
            </label>
            <input
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="email"
              placeholder="example@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div id="input-section" className="my-2.5 opacity-0">
            <label className="flex text-left font-hypatia text-xl">
              Phone:
            </label>
            <input
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              //type="tel"
              placeholder="(555) 555-5555"
              //pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div id="input-section" className="my-2.5 opacity-0">
            <label className="flex text-left font-hypatia text-xl">
              Preferred Date:
            </label>
            <input
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="date"
              value={preferredDate}
              placeholder="Select a date"
              required
              onChange={(e) => setPreferredDate(e.target.value)}
            />
          </div>
          <div id="input-section" className="my-2.5 opacity-0">
            <label className="flex text-left font-hypatia text-xl">
              What is your budget?
            </label>
            <input
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="text"
              placeholder="e.g., $500 - $1000"
              value={budget}
              required
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div id="input-section" className="my-2.5 opacity-0">
            <label className="flex text-left font-hypatia text-xl">
              How did you hear about us?
            </label>
            <select
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              required
              value={howDidYouHear}
              onChange={(e) => setHowDidYouHear(e.target.value)}
            >
              <option value="" disabled>
                Select one
              </option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>
          </div>
          <div id="input-section" className="my-2.5 opacity-0">
            <label className="flex text-left font-hypatia text-xl">
              Message:
            </label>
            <textarea
              className="h-52 w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              placeholder="Add any additional information/ideas here."
              value={message}
              required
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            id="input-section"
            className="mt-7 rounded-full bg-customGold px-14 py-3.5 font-hypatia font-bold tracking-wider opacity-0"
          >
            <span className="text-sm leading-none text-white">SUBMIT</span>
          </button>
        </form>
      </div>
    </div>
  );
}
