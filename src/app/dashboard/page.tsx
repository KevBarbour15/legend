"use client";
import React, { useState } from "react";

// Dashboard components
import DashHeader from "@/components/dash-header/DashHeader";
import CreateEvent from "@/components/create-event/CreateEvent";
import LiveStream from "@/components/live-stream/LiveStream";
import EventsList from "@/components/events/Events";
import MessagesList from "@/components/messages/Messages";
import UpcomingEventsList from "@/components/upcoming-events/UpcomingEvents";
import PastEventsList from "@/components/past-events/PastEvents";

// Next.js imports and Kinde Auth
import { redirect } from "next/navigation";
const postLogoutRedirectURL = process.env.KINDE_POST_LOGOUT_REDIRECT_URL;
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

// Default component
const DefaultComponent: React.FC = () => <div>No component selected</div>;

// Set display names
CreateEvent.displayName = "CreateEvent";
LiveStream.displayName = "LiveStream";
EventsList.displayName = "EventsList";
UpcomingEventsList.displayName = "UpcomingEventsList";
PastEventsList.displayName = "PastEventsList";
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
    case "Upcoming Events":
      CurrentComponent = UpcomingEventsList;
      break;
    case "Past Events":
      CurrentComponent = PastEventsList;
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
      <div className="">
        <DashHeader setActiveTab={setActiveTab} />
        <CurrentComponent />
      </div>
    </>
  );
}
