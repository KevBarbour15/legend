"use client";
import React, { useState, useEffect } from "react";
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

const MessagesList: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<number>(4);

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
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime(),
  );

  return (
    <div className="flex w-screen flex-col items-center justify-center text-center">
      {loading ? (
        <h1 className="mt-3.5 font-bigola text-4xl text-customCream lg:text-5xl">
          Loading messages...
        </h1>
      ) : sortedMessages.length === 0 ? (
        <h1 className="mt-3.5 font-bigola text-4xl text-customCream lg:text-5xl">
          No messages found.
        </h1>
      ) : (
        <>
          <h1 className="mt-3.5 font-bigola text-4xl text-customCream lg:text-5xl">
            Messages
          </h1>
          {sortedMessages.map((message, index) => (
            <MessageCard key={index} fetchMessages={fetchMessages}  message={message} />
          ))}
        </>
      )}
    </div>
  );
};

export default MessagesList;
