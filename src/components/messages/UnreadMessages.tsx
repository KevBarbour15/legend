"use client";
import { useState, useEffect, useRef, useMemo } from "react";

import { Message } from "@/data/messages";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { generateProgress } from "@/utils/progress";

import MessageCard from "@/components/message-card/MessageCard";
import Loading from "@/components/loading/Loading";

import { Accordion } from "@/components/ui/accordion";

const UnreadMessagesList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tL = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useGSAP(() => {
    if (!containerRef.current) return;
    if (loading) return;
    gsap.fromTo(
      "#messages-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.35, delay: 0.15, ease: "sine.inOut" },
    );
  }, [loading]);

  const unreadMessages = useMemo(
    () =>
      messages
        .filter((message) => !message.read)
        .sort(
          (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
        ),
    [messages],
  );

  const updateProgress = (start: number, end: number, delay = 0) => {
    setTimeout(() => setProgress(generateProgress(start, end)), delay);
  };

  const fetchMessages = async () => {
    try {
      updateProgress(34, 66);
      const response = await fetch("/api/message");

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data: Message[] = await response.json();
      updateProgress(67, 99, 750);
      setMessages(data);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Unknown error occurred");
      console.error("Error: ", err);
      setError(err);
      setProgress(0);
    } finally {
      updateProgress(100, 100);
      setTimeout(() => setLoading(false), 750);
    }
  };

  useEffect(() => {
    setProgress(generateProgress(1, 33));
    fetchMessages();
  }, []);

  return (
    <div
      ref={containerRef}
      id="messages-container"
      className="block text-black"
    >
      {loading ? (
        <Loading
          progress={progress}
          message="Loading messages..."
          textColor="black"
          borderColor="border-black"
        />
      ) : error ? (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <h2 className="mb-6 text-3xl md:text-4xl">{error.message}</h2>
        </div>
      ) : !loading && unreadMessages.length === 0 ? (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <h2 className="mb-6 text-3xl md:text-4xl">No messages found.</h2>
        </div>
      ) : (
        <div>
          <Accordion
            type="single"
            collapsible
            className="w-full border-b border-black"
          >
            {unreadMessages.map((message, index) => (
              <div key={index}>
                <MessageCard
                  message={message}
                  index={index}
                  fetchMessages={fetchMessages}
                />
              </div>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default UnreadMessagesList;
