import React, { useState, useEffect } from "react";

const CreateEvent: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !date || !time || !description || !imageURL) {
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
          image_url: imageURL,
        }),
      });

      if (response.ok) {
        alert("Event created successfully.");
        setTitle("");
        setDate("");
        setTime("");
        setImageURL("");
        setDescription("");
      }
    } catch (error) {
      console.log("Error: ", error);
      setError("Failed to create event");
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setDate(formattedDate);
  }, []);

  return (
    <div className="flex w-screen flex-col items-center justify-center text-center">
      <h1 className="mt-3.5 font-bigola text-4xl text-customCream lg:text-5xl">
        Create Event
      </h1>
      <div>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="my-2.5">
            <label className="flex text-left font-hypatia text-xl">
              Event Name:
            </label>

            <input
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="text"
              placeholder="For ex: Jose's Birthday Party"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="my-2.5">
            <label className="flex text-left font-hypatia text-xl">Date:</label>
            <input
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="my-2.5">
            <label className="flex text-left font-hypatia text-xl">Time:</label>
            <input
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="my-2.5">
            <label className="flex text-left font-hypatia text-xl">
              Image URL:
            </label>
            <input
              className="w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="text"
              required
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="Add image address from Imgur"
            />
          </div>

          <div className="my-2.5">
            <label className="flex text-left font-hypatia text-xl">
              Event Description:
            </label>
            <textarea
              className="h-52 w-85vw rounded-lg border border-white border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-white hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              placeholder="Add any additional information/ideas here."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            className="mt-7 rounded-full bg-customGold px-14 py-3.5 font-hypatia font-bold tracking-wider"
            type="submit"
          >
            <span className="text-sm leading-none text-white">SUBMIT</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
