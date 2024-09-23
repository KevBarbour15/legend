"use client";
import { useState, useEffect, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import MessageCard from "@/components/message-card/MessageCard";

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

const UnreadMessagesList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  const unreadMessages = messages
    .filter((message) => !message.read)
    .sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
    );

  return (
    <div
      ref={containerRef}
      id="messages-container"
      className="z-10 flex w-screen flex-col p-3 text-black md:py-6 md:pl-[275px] md:pr-6"
    >
      {loading ? (
        <h2 className="text-center font-bigola text-4xl text-black md:text-left">
          Loading messages...
        </h2>
      ) : unreadMessages.length === 0 ? (
        <h2 className="text-center font-bigola text-4xl text-black md:text-left">
          No messages found.
        </h2>
      ) : (
        <>
          {unreadMessages.map((message, index) => (
            <MessageCard
              message={message}
              index={index}
              fetchMessages={fetchMessages}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default UnreadMessagesList;
