"use client";
import React, { useState } from "react";

// Dashboard components
import DashHeader from "@/components/dash-header/DashHeader";
import CreateEvent from "@/components/create-event/CreateEvent";
import LiveStream from "@/components/live-stream/LiveStream";
import EventsList from "@/components/events/Events";
import MessagesList from "@/components/messages/Messages";

export default function Dashboard() {
  let [activeTab, setActiveTab] = useState<string>("Create Event");

  // change the active tab based on the button clicked
  let CurrentComponent;
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
      <DashHeader setActiveTab={setActiveTab} />
      <CurrentComponent />
    </>
  );
}
