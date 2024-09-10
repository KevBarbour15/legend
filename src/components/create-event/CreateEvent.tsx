import React, { useRef, useState, useEffect } from "react";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Switch from "@mui/material/Switch";

const CreateEvent: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("12:00");
  const [description, setDescription] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [isPhoto, setIsPhoto] = useState<boolean>(true);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.set(containerRef.current, { opacity: 0 });

    tl.current = gsap.timeline({}).to(containerRef.current, {
      delay: 0.35,
      duration: 0.5,
      opacity: 1,
    });
  }, []);

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
          is_public: true,
          is_photo: isPhoto,
        }),
      });

      if (response.ok) {
        alert("Event created successfully.");
        setTitle("");
        setDate("");
        setTime("");
        setImageURL("");
        setDescription("");
        setIsPhoto(true);
        setIsPublic(true);
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
    <div
      ref={containerRef}
      className="my-6 flex w-screen flex-col text-center opacity-0"
    >
      <h1 className="font-bigola text-4xl text-customWhite lg:text-5xl">
        Create Event
      </h1>
      <div>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="my-3">
            <div className="flex w-fit items-center justify-center pb-3">
              <label className="font-hypatia text-xl text-customWhite">
                Hidden
              </label>
              <Switch
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                inputProps={{ "aria-label": "controlled" }}
              />
              <label className="font-hypatia text-xl text-customWhite">
                Public
              </label>
            </div>
            <label className="flex text-left font-hypatia text-xl">
              Event Name:
            </label>

            <input
              className="w-85vw rounded-lg border border-customWhite border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="text"
              placeholder="For ex: Jose's Birthday Party"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="my-3">
            <label className="flex text-left font-hypatia text-xl">Date:</label>
            <input
              className="w-85vw rounded-lg border border-customWhite border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="my-3">
            <label className="flex text-left font-hypatia text-xl">Time:</label>
            <input
              className="w-85vw rounded-lg border border-customWhite border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="my-3 flex flex-col">
            <label className="flex w-85vw text-left font-hypatia text-xl lg:w-50vw xl:w-45vw xxl:w-40vw">
              Image or Video URL from Imgur (for video convert to MP4):
            </label>
            <input
              className="w-85vw rounded-lg border border-customWhite border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              type="text"
              required
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="Add image address from Imgur"
            />
            <div className="flex w-fit items-center justify-center pt-3">
              <label className="font-hypatia text-xl text-customWhite">
                Video
              </label>
              <Switch
                checked={isPhoto}
                onChange={() => setIsPhoto(!isPhoto)}
                inputProps={{ "aria-label": "controlled" }}
              />
              <label className="font-hypatia text-xl text-customWhite">
                Photo
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="flex text-left font-hypatia text-xl">
              Event Description:
            </label>
            <textarea
              className="h-52 w-85vw rounded-lg border border-customWhite border-opacity-50 bg-transparent px-4 py-2 font-ubuntuRegular text-customWhite hover:border-opacity-75 hover:outline-none focus:border-opacity-100 focus:outline-none lg:w-50vw xl:w-45vw xxl:w-40vw"
              placeholder="Add any additional information/ideas here."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button className="py-3" type="submit">
            <span className="font-bigola text-2xl leading-none text-customWhite">
              SUBMIT
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
