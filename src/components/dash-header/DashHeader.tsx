import Link from "next/link";
import React from "react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface DashProps {
  setActiveTab: (tab: string) => void;
}

const DashHeader: React.FC<DashProps> = ({ setActiveTab }) => {
  // TO DO: need to get the unread messages count for the user

  return (
    <div className="flex flex-row justify-center items-center w-screen bg-customGold ">
      <div className="flex flex-row justify-between items-center w-7/12 my-2.5 font-hypatia text-xl">
        <button onClick={() => setActiveTab("Create Event")}>
          Create Event
        </button>
        <button onClick={() => setActiveTab("Events List")}>Events</button>
        <button onClick={() => setActiveTab("Messages")}>Messages</button>
        <button onClick={() => setActiveTab("Live Stream")}>Live Stream</button>
        <LogoutLink postLogoutRedirectURL="/">Logout</LogoutLink>
      </div>
    </div>
  );
};

export default DashHeader;
