"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import DashboardSidebar, {
  DashboardSidebarTrigger,
} from "@/components/dashboard-sidebar/DashboardSidebar";
import CreateEvent from "@/components/create-event/CreateEvent";
import UnreadMessagesList from "@/components/messages/UnreadMessages";
import ReadMessagesList from "@/components/messages/ReadMessages";
import UpcomingEventsList from "@/components/dash-events/UpcomingEvents";
import PastEventsList from "@/components/dash-events/PastEvents";
import MenuCategories from "@/components/menu-categories/MenuCategories";
import JobApplicationsList from "@/components/job-applications/JobApplicationsList";
import DashboardEmptyState from "@/components/dashboard-detail/DashboardEmptyState";
import { HouseLine, List } from "@phosphor-icons/react";

const DefaultComponent: React.FC = () => (
  <DashboardEmptyState
    message="Select a section from the sidebar"
    description="Use the menu to open Events, Messages, Menu Categories, or Job Applications."
    icon={<List weight="duotone" />}
  />
);

CreateEvent.displayName = "CreateEvent";
UpcomingEventsList.displayName = "UpcomingEventsList";
PastEventsList.displayName = "PastEventsList";
UnreadMessagesList.displayName = "MessagesList";
MenuCategories.displayName = "MenuCategories";
JobApplicationsList.displayName = "JobApplicationsList";
DefaultComponent.displayName = "DefaultComponent";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("Create Event");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = useCallback(() => {
    setSidebarOpen(false);
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
    case "Job Applications":
      CurrentComponent = JobApplicationsList;
      break;
    default:
      CurrentComponent = DefaultComponent;
  }

  return (
    <div className="flex min-h-screen bg-stone-100">
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigate={handleNav}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-stone-200 bg-white px-4 shadow-sm">
          <DashboardSidebarTrigger onClick={() => setSidebarOpen(true)} />
          <div className="flex flex-1 items-center justify-between gap-4">
            <h1 className="truncate text-lg font-semibold text-stone-800">
              {activeTab}
            </h1>
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 sm:flex"
            >
              <HouseLine size={18} weight="regular" />
              Back to site
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <CurrentComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
