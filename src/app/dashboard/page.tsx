"use client";
import { useState, useEffect, useRef } from "react";

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
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

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
    <div
      className="h-auto min-h-screen w-full bg-customWhite font-funnelDisplay"
      style={{ paddingTop: `${headerHeight}px` }}
    >
      <header ref={headerRef} className="fixed top-0 z-50 w-full bg-black py-3">
        <DashHeader setActiveTab={setActiveTab} activeTab={activeTab} />
      </header>

      <div className="container overflow-y-scroll py-3">
        <CurrentComponent />
      </div>
    </div>
  );
}
