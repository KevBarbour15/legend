"use client";
import { useState, useEffect, useRef } from "react";

import { Message } from "@/types/messages";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import MessageCard from "@/components/message-card/MessageCard";

import { Accordion } from "@/components/ui/accordion";

const ReadMessagesList: React.FC = () => {
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

    tL.current = gsap.timeline().to("#messages-container", {
      duration: 0.25,
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

  const readMessages = messages
    .filter((message) => message.read)
    .sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
    );

  return (
    <div
      ref={containerRef}
      id="messages-container"
      className="block text-black"
    >
      {loading ? (
        <h2 className="text-center font-bigola text-4xl text-black">
          Loading messages...
        </h2>
      ) : readMessages.length === 0 ? (
        <h2 className="text-center font-bigola text-4xl text-black">
          No messages found.
        </h2>
      ) : (
        <>
          <Accordion
            type="single"
            collapsible
            className="w-full border-b border-black"
          >
            {readMessages.map((message, index) => (
              <div key={index}>
                <MessageCard
                  message={message}
                  index={index}
                  fetchMessages={fetchMessages}
                />
              </div>
            ))}
          </Accordion>
        </>
      )}
    </div>
  );
};

export default ReadMessagesList;
