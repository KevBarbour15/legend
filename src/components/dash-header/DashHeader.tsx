import React from "react";

import Link from "next/link";
import Image from "next/image";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { IconButton } from "@mui/material";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  BookOpenText,
  Envelope,
  EnvelopeOpen,
  SignOut,
  HouseLine,
  CalendarPlus,
  CalendarDots,
  CalendarCheck,
  List,
} from "@phosphor-icons/react";

interface DashProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const DashHeader: React.FC<DashProps> = ({ setActiveTab, activeTab }) => {
  const postLogoutRedirectURL = process.env.KINDE_POST_LOGOUT_REDIRECT_URL;

  const handleMenuItemClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="container relative flex items-center justify-between">
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton className="p-0 text-customWhite transition-all duration-300 md:hover:rotate-[360deg]">
              <List size={32} weight="regular" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="font-funnelDisplay">
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Create Event")}
            >
              <CalendarPlus
                className="mr-3 md:mr-6"
                size={32}
                weight="regular"
              />
              Create Event
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Upcoming Events")}
            >
              <CalendarDots
                className="mr-3 md:mr-6"
                size={32}
                weight="regular"
              />
              Upcoming Events
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Past Events")}
            >
              <CalendarCheck
                className="mr-3 md:mr-6"
                size={32}
                weight="regular"
              />
              Past Events
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Unread Messages")}
            >
              <Envelope className="mr-3 md:mr-6" size={32} weight="regular" />
              Unread Messages
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Read Messages")}
            >
              <EnvelopeOpen
                className="mr-3 md:mr-6"
                size={32}
                weight="regular"
              />
              Read Messages
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Menu Categories")}
            >
              <BookOpenText
                className="mr-3 md:mr-6"
                size={32}
                weight="regular"
              />
              Menu Categories
            </DropdownMenuItem>
            <LogoutLink postLogoutRedirectURL={postLogoutRedirectURL}>
              <DropdownMenuItem>
                <SignOut size={32} weight="regular" className="mr-3 md:mr-6" />
                Logout
              </DropdownMenuItem>
            </LogoutLink>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-3 font-funnelDisplay text-base font-bold md:ml-6 md:text-xl">
          {activeTab}
        </div>
      </div>
      <Link href="/" className="h-full text-black">
        <IconButton className="p-0 text-customWhite transition-all duration-300 md:hover:rotate-[360deg]">
          <HouseLine size={32} weight="regular" />
        </IconButton>
      </Link>
    </div>
  );
};

export default DashHeader;
