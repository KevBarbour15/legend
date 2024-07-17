"use client";
import React, { useState } from "react";

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

  return (
    <div className="flex flex-col justify-center w-screen">
      <h2 className="font-bigola text-customCream text-5xl text-center my-6">
        Let's Work Together
      </h2>
      <div>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">Name:</label>
            <div className="flex flex-col sm:flex-row w-50vw justify-between">
              <input
                className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg flex-1 sm:mr-1 focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
                type="text"
                placeholder="First Name"
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg flex-1 sm:ml-1 focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
                type="text"
                placeholder="Last Name"
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">
              Email:
            </label>
            <input
              className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              type="email"
              placeholder="example@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">
              Phone:
            </label>
            <input
              className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              //type="tel"
              placeholder="(555) 555-5555"
              //pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              required
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">
              Preferred Date:
            </label>
            <input
              className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              type="date"
              required
              onChange={(e) => setPreferredDate(e.target.value)}
            />
          </div>
          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">
              What is your budget?
            </label>
            <input
              className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              type="text"
              placeholder="e.g., $500 - $1000"
              required
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">
              How did you hear about us?
            </label>
            <select
              className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              required
              onChange={(e) => setHowDidYouHear(e.target.value)}
            >
              <option defaultValue="" disabled>
                Select one
              </option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>
          </div>
          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">
              Message:
            </label>
            <textarea
              className="bg-transparent font-ubuntuRegular py-2 px-4 h-52 border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              placeholder="Add any additional information/ideas here."
              required
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 mt-7 tracking-wider">
            <span className="text-white leading-none text-sm">SUBMIT</span>
          </button>
        </form>
      </div>
    </div>
  );
}
