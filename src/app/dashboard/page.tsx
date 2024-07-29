"use client";
import React, { useState } from "react";

// Dashboard components
import DashHeader from "@/components/dash-header/DashHeader";
import CreateEvent from "@/components/create-event/CreateEvent";
import LiveStream from "@/components/live-stream/LiveStream";
import EventsList from "@/components/events/Events";
import MessagesList from "@/components/messages/Messages";

// Default component
const DefaultComponent: React.FC = () => <div>No component selected</div>;

// Set display names
CreateEvent.displayName = "CreateEvent";
LiveStream.displayName = "LiveStream";
EventsList.displayName = "EventsList";
MessagesList.displayName = "MessagesList";
DefaultComponent.displayName = "DefaultComponent";

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
      CurrentComponent = DefaultComponent;
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
