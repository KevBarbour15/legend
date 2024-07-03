import React, { useState } from "react";

const CreateEvent: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !date || !time || !description) {
      console.log("Error: Please fill out all fields.");
      setError("Please fill out all fields.");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          date: date,
          time: time,
          description: description,
        }),
      });

      if (response.ok) {
        console.log("Event created successfully!");
        setTitle("");
        setDate("");
        setTime("");
        setDescription("");
      } else {
        const errorData = await response.json();
        console.log("Error: ", errorData.error);
        setError(errorData.error);
      }
    } catch (error) {
      console.log("Error: ", error);
      setError("Failed to create event");
    }
  };

  return (
    <div className="flex flex-col w-screen justify-center items-center text-center">
      <h1 className="font-bigola  text-customCream text-4xl my-3.5">
        Create Event
      </h1>
      <div>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">
              Event Name:
            </label>

            <input
              className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              type="text"
              placeholder="Enter event name here."
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">Date:</label>
            <input
              className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              type="date"
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">Time:</label>
            <input
              className="bg-transparent font-ubuntuRegular py-2 px-4  border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              type="time"
              required
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="my-2.5">
            <label className="flex text-left text-xl font-hypatia">
              Event Description:
            </label>
            <textarea
              className="bg-transparent font-ubuntuRegular py-2 px-4 h-52 border border-white border-opacity-50 rounded-lg w-50vw focus:outline-none hover:outline-none focus:border-opacity-100 hover:border-opacity-75 text-white"
              placeholder="Add any additional information/ideas here."
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            className="font-hypatia font-bold bg-customGold rounded-full py-3.5 px-14 mt-7 tracking-wider"
            type="submit"
          >
            <span className="text-white leading-none text-sm">SUBMIT</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
