"use client";
import React, { useState, useEffect } from "react";
import MessageCard from "@/components/message-card/MessageCard";

interface Message {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  preferredDate: string;
  sentAt: Date;
  howDidYouHear: string;
  budget: string;
  message: string;
  read: boolean;
}

const MessagesList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/message?action=${"getMessages"}`);

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
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );

  return (
    <div className="flex flex-col w-screen justify-center items-center text-center">
      {loading ? (
        <h1 className="font-bigola  text-customCream text-4xl lg:text-5xl mt-3.5">
          Loading messages...
        </h1>
      ) : sortedMessages.length === 0 ? (
        <h1 className="font-bigola  text-customCream text-4xl lg:text-5xl mt-3.5">
          No messages found.
        </h1>
      ) : (
        <>
          <h1 className="font-bigola  text-customCream text-4xl lg:text-5xl mt-3.5">
            Messages
          </h1>
          {sortedMessages.map((message, index) => (
            <MessageCard key={index} message={message} />
          ))}
        </>
      )}
    </div>
  );
};

export default MessagesList;
