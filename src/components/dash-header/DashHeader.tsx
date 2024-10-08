import React from "react";
import { Menu } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Mail,
  CalendarArrowUp,
  CalendarArrowDown,
  CalendarPlus,
  LogOut,
  MailOpen,
} from "lucide-react";

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
    <header className="sticky top-0 z-50 bg-black py-3">
      <div className="container relative flex items-center justify-between">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="text-black">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="p-3">
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Create Event")}
              >
                <CalendarPlus className="mr-3 md:mr-6" /> Create Event
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Upcoming Events")}
              >
                <CalendarArrowUp className="mr-3 md:mr-6" /> Upcoming Events
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Past Events")}
              >
                <CalendarArrowDown className="mr-3 md:mr-6" /> Past Events
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Unread Messages")}
              >
                <Mail className="mr-3 md:mr-6" /> Unread Messages
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Read Messages")}
              >
                <MailOpen className="mr-3 md:mr-6" /> Read Messages
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="ml-3 font-bigola text-base font-bold md:ml-6 md:text-xl">
            {activeTab}
          </div>
        </div>
        <div className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
          <img
            className="h-10"
            src="./images/small-logo.png"
            alt="Small Logo"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="mr-3 font-bigola text-base font-bold md:mr-6 md:text-xl">
            <p>Logout</p>
          </div>
          <LogoutLink postLogoutRedirectURL={postLogoutRedirectURL}>
            <Button variant="outline" size="icon" className="text-black">
              <LogOut className="" />
            </Button>
          </LogoutLink>
        </div>
      </div>
    </header>
  );
};

export default DashHeader;
