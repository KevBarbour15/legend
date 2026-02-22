"use client";

import React from "react";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  BookOpenText,
  Envelope,
  EnvelopeOpen,
  SignOut,
  HouseLine,
  CalendarPlus,
  CalendarDots,
  CalendarCheck,
  Briefcase,
  X,
  List,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Events",
    items: [
      { id: "Create Event", icon: CalendarPlus, label: "Create Event" },
      { id: "Upcoming Events", icon: CalendarDots, label: "Upcoming Events" },
      { id: "Past Events", icon: CalendarCheck, label: "Past Events" },
    ],
  },
  {
    label: "Messages",
    items: [
      { id: "Unread Messages", icon: Envelope, label: "Unread Messages" },
      { id: "Read Messages", icon: EnvelopeOpen, label: "Read Messages" },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "Menu Categories", icon: BookOpenText, label: "Menu Categories" },
    ],
  },
  {
    label: "Hiring",
    items: [
      { id: "Job Applications", icon: Briefcase, label: "Job Applications" },
    ],
  },
] as const;

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
}

export default function DashboardSidebar({
  activeTab,
  setActiveTab,
  onNavigate,
  mobileOpen = false,
  onMobileClose,
  className,
}: DashboardSidebarProps) {
  const postLogoutRedirectURL = process.env.KINDE_POST_LOGOUT_REDIRECT_URL;

  const handleClick = (tab: string) => {
    setActiveTab(tab);
    onNavigate?.();
    onMobileClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col border-r border-stone-200 bg-white shadow-sm transition-transform duration-200 ease-out lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-stone-200 px-4 lg:justify-start">
          <span className="font-funnelDisplay text-lg font-semibold text-stone-800">
            Dashboard
          </span>
          <button
            type="button"
            aria-label="Close menu"
            className="rounded p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-700 lg:hidden"
            onClick={onMobileClose}
          >
            <X size={24} weight="regular" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-6 px-3">
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
                {group.label}
              </h3>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleClick(item.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors",
                          isActive
                            ? "bg-stone-900 text-white"
                            : "text-stone-700 hover:bg-stone-100"
                        )}
                      >
                        <Icon
                          size={20}
                          weight="regular"
                          className="flex-shrink-0"
                        />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-stone-200 p-3">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          >
            <HouseLine size={20} weight="regular" className="flex-shrink-0" />
            Back to site
          </Link>
          <LogoutLink postLogoutRedirectURL={postLogoutRedirectURL}>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              <SignOut size={20} weight="regular" className="flex-shrink-0" />
              Log out
            </button>
          </LogoutLink>
        </div>
      </aside>
    </>
  );
}

export function DashboardSidebarTrigger({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={onClick}
      className={cn(
        "rounded p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 lg:hidden",
        className
      )}
    >
      <List size={24} weight="regular" />
    </button>
  );
}
