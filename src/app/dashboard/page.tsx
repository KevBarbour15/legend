"use client";
import React, { useState } from "react";

import DashHeader from "@/components/dash-header/DashHeader";
import CreateEvent from "@/components/create-event/CreateEvent";
import LiveStream from "@/components/live-stream/LiveStream";
import UnreadMessagesList from "@/components/messages/UnreadMessages";
import ReadMessagesList from "@/components/messages/ReadMessages";
import UpcomingEventsList from "@/components/events/UpcomingEvents";
import PastEventsList from "@/components/events/PastEvents";

const DefaultComponent: React.FC = () => <div>No component selected</div>;

CreateEvent.displayName = "CreateEvent";
LiveStream.displayName = "LiveStream";
UpcomingEventsList.displayName = "UpcomingEventsList";
PastEventsList.displayName = "PastEventsList";
UnreadMessagesList.displayName = "MessagesList";
DefaultComponent.displayName = "DefaultComponent";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("Create Event");

  let CurrentComponent: React.ComponentType<any>;
  switch (activeTab) {
    case "Create Event":
      CurrentComponent = CreateEvent;
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
    case "Unread Messages":
      CurrentComponent = UnreadMessagesList;
      break;
    case "Read Messages":
      CurrentComponent = ReadMessagesList;
      break;
    default:
      CurrentComponent = DefaultComponent;
  }

  return (
    <div className="flex h-screen flex-col bg-customWhite">
      <DashHeader setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-3 md:py-6">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}
