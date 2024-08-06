"use client";
import { useState, useEffect, useRef, use } from "react";
import MessageCard from "@/components/message-card/MessageCard";

//gsap imports
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface Message {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  sentAt: Date;
  howDidYouHear: string;
  budget: string;
  message: string;
  read: boolean;
  contacted: boolean;
  _id: string;
}

const MessagesList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<number>(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const tL = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set("#messages-container", {
      opacity: 0,
    });

    tL.current = gsap
      .timeline({ defaults: { ease: "power3.inOut" } })
      .to("#messages-container", {
        delay: 0.35,
        duration: 0.5,
        opacity: 1,
      });
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/message");

      if (!response.ok) {
        throw new Error("Failed to fetch messages.");
      }

      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.log("Error: ", error);
      setError("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // sort events by date
  const sortedMessages = messages.sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
  );

  return (
    <div
      ref={containerRef}
      id="messages-container"
      className="flex w-screen flex-col items-center justify-center text-center"
    >
      {loading ? (
        <h1 className="mt-5 font-bigola text-4xl text-customWhite lg:text-5xl">
          Loading messages...
        </h1>
      ) : sortedMessages.length === 0 ? (
        <h1 className="mt-5 font-bigola text-4xl text-customWhite lg:text-5xl">
          No messages found.
        </h1>
      ) : (
        <>
          {sortedMessages.map((message, index) => (
            <MessageCard
              key={index}
              fetchMessages={fetchMessages}
              message={message}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default MessagesList;
