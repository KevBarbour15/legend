"use client";
import { useState } from "react";

import DashHeader from "@/components/dash-header/DashHeader";
import CreateEvent from "@/components/create-event/CreateEvent";

import UnreadMessagesList from "@/components/messages/UnreadMessages";
import ReadMessagesList from "@/components/messages/ReadMessages";
import UpcomingEventsList from "@/components/events/UpcomingEvents";
import PastEventsList from "@/components/events/PastEvents";
import MenuCategories from "@/components/menu-categories/MenuCategories";

const DefaultComponent: React.FC = () => <div>No component selected</div>;

CreateEvent.displayName = "CreateEvent";
UpcomingEventsList.displayName = "UpcomingEventsList";
PastEventsList.displayName = "PastEventsList";
UnreadMessagesList.displayName = "MessagesList";
MenuCategories.displayName = "MenuCategories";
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
    case "Unread Messages":
      CurrentComponent = UnreadMessagesList;
      break;
    case "Read Messages":
      CurrentComponent = ReadMessagesList;
      break;
    case "Menu Categories":
      CurrentComponent = MenuCategories;
      break;
    default:
      CurrentComponent = DefaultComponent;
  }

  return (
    <div className="flex min-h-screen flex-col bg-customWhite">
      <DashHeader setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="container min-h-screen overflow-y-scroll pb-12 pt-3 md:pt-6">
        <CurrentComponent />
      </div>
    </div>
  );
}
