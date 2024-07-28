"use client";
import React, { useEffect, useState } from "react";

// Dashboard components
import DashHeader from "@/components/dash-header/DashHeader";
import CreateEvent from "@/components/create-event/CreateEvent";
import LiveStream from "@/components/live-stream/LiveStream";
import EventsList from "@/components/events/Events";
import MessagesList from "@/components/messages/Messages";

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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("Create Event");
  
  // change the active tab based on the button clicked
  let CurrentComponent: React.ComponentType<any>;
  switch (activeTab) {
    case "Create Event":
      CurrentComponent = CreateEvent;
      break;
    case "Events List":
      CurrentComponent = EventsList;
      break;
    case "Live Stream":
      CurrentComponent = LiveStream;
      break;
    case "Messages":
      CurrentComponent = MessagesList;
      break;

    default:
      CurrentComponent = () => <div></div>;
  }

  return (
    <>
      <div className="pt-135">
        <DashHeader setActiveTab={setActiveTab}/>
        <CurrentComponent />
      </div>
    </>
  );
}
