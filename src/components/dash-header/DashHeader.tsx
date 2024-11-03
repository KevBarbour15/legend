import React from "react";

import Link from "next/link";

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
    <header className="sticky top-0 z-50 bg-black py-3">
      <div className="container relative flex items-center justify-between">
        <div className="flex h-fit items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="text-black">
                <List size={32} weight="regular" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="p-3">
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Create Event")}
              >
                <CalendarPlus
                  className="mr-3 md:mr-6"
                  size={32}
                  weight="duotone"
                />
                Create Event
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Upcoming Events")}
              >
                <CalendarDots
                  className="mr-3 md:mr-6"
                  size={32}
                  weight="duotone"
                />
                Upcoming Events
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Past Events")}
              >
                <CalendarCheck
                  className="mr-3 md:mr-6"
                  size={32}
                  weight="duotone"
                />
                Past Events
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Unread Messages")}
              >
                <Envelope className="mr-3 md:mr-6" size={32} weight="duotone" />
                Unread Messages
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Read Messages")}
              >
                <EnvelopeOpen
                  className="mr-3 md:mr-6"
                  size={32}
                  weight="duotone"
                />
                Read Messages
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMenuItemClick("Menu Categories")}
              >
                <BookOpenText
                  className="mr-3 md:mr-6"
                  size={32}
                  weight="duotone"
                />
                Menu Categories
              </DropdownMenuItem>
              <LogoutLink postLogoutRedirectURL={postLogoutRedirectURL}>
                <DropdownMenuItem>
                  <SignOut
                    size={32}
                    weight="duotone"
                    className="mr-3 md:mr-6"
                  />
                  Logout
                </DropdownMenuItem>
              </LogoutLink>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="ml-3 font-bigola text-base font-bold md:ml-6 md:text-xl">
            {activeTab}
          </div>
        </div>
        <div className="absolute left-1/2 hidden -translate-x-1/2 transform md:block">
          <img className="h-12" src="./images/alt-logo.png" alt="Alt Logo" />
        </div>
        <Link href="/">
          <Button variant="outline" size="icon" className="text-black">
            <HouseLine size={32} weight="duotone" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default DashHeader;
