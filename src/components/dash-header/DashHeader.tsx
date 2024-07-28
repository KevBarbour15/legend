import Link from "next/link";
import {useState} from "react";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface DashProps {
  setActiveTab: (tab: string) => void;

}

const DashHeader: React.FC<DashProps> = ({ setActiveTab}) => {
  // TO DO: need to get the unread messages count for the user

  return (
    <div className="flex w-screen flex-row items-center justify-center bg-customGold">
      <div className="my-2.5 flex w-90vw flex-row items-center justify-between font-bigola text-base lg:w-50vw lg:text-xl xl:w-45vw xxl:w-40vw">
        <button onClick={() => setActiveTab("Messages")}>
          <Badge className="z-1" badgeContent={0}  color="primary">
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
