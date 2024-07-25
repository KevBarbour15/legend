import Link from "next/link";
import React from "react";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface DashProps {
  setActiveTab: (tab: string) => void;
}

const DashHeader: React.FC<DashProps> = ({ setActiveTab }) => {
  // TO DO: need to get the unread messages count for the user

  return (
    <div className="flex flex-row justify-center items-center w-screen bg-customGold">
      <div className="flex flex-row justify-between items-center w-90vw lg:w-50vw xl:w-45vw xxl:w-40vw my-2.5 font-bigola text-base lg:text-xl">
        <button onClick={() => setActiveTab("Messages")}>
          <Badge className="z-1" badgeContent={3} color="primary">
            <MailIcon />
          </Badge>
        </button>
        <button onClick={() => setActiveTab("Create Event")}>
          Create Event
        </button>
        <button onClick={() => setActiveTab("Events List")}>Events</button>
        <button onClick={() => setActiveTab("Live Stream")}>Live Stream</button>

        <LogoutLink postLogoutRedirectURL="/">
          <LogoutIcon />
        </LogoutLink>
      </div>
    </div>
  );
};

export default DashHeader;
