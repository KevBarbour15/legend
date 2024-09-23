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
import { Mail, Calendar, CalendarPlus, LogOut } from "lucide-react";

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
    <header className="sticky top-0 z-50 w-full bg-black p-3 md:px-6">
      <div className="container flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-3">
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Create Event")}
            >
              <CalendarPlus className="mr-3 h-4 w-4" /> Create Event
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Upcoming Events")}
            >
              <Calendar className="mr-3 h-4 w-4" /> Upcoming Events
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Past Events")}
            >
              <Calendar className="mr-3 h-4 w-4" /> Past Events
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Unread Messages")}
            >
              <Mail className="mr-3 h-4 w-4" /> Unread Messages
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMenuItemClick("Read Messages")}
            >
              <Mail className="mr-3 h-4 w-4" /> Read Messages
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-3 flex-1 font-bigola text-xl font-bold md:mr-6">
          {activeTab}
        </div>
        <LogoutLink postLogoutRedirectURL={postLogoutRedirectURL}>
          <Button variant="ghost" className="font-bigola text-lg">
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </LogoutLink>
      </div>
    </header>
  );
};

export default DashHeader;
