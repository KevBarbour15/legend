import Link from "next/link";
import { useRef, useState } from "react";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface DashProps {
  setActiveTab: (tab: string) => void;
}

const DashHeader: React.FC<DashProps> = ({ setActiveTab }) => {
  // TO DO: need to get the unread messages count for the user
  const postLogoutRedirectURL = process.env.KINDE_POST_LOGOUT_REDIRECT_URL;
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set("#menu-item", {
      opacity: 0,
      scale: 0.75,
    });

    tlRef.current = gsap.timeline({}).to(
      "#menu-item",
      {
        duration: 0.35,
        opacity: 1,
        scale: 1,
        ease: "linear",
        stagger: 0.1,
      },
      0.35,
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-screen flex-row items-center justify-center bg-customGold"
    >
      <div className="my-2.5 flex w-90vw flex-row items-center justify-between font-bigola text-base lg:w-50vw lg:text-xl xl:w-45vw xxl:w-40vw">
        <button
          id="menu-item"
          className="opacity-0"
          onClick={() => setActiveTab("Messages")}
        >
          <Badge className="z-1" badgeContent={0} color="primary">
            <MailIcon />
          </Badge>
        </button>
        <button
          id="menu-item"
          className="opacity-0"
          onClick={() => setActiveTab("Create Event")}
        >
          Create Event
        </button>
        <button
          id="menu-item"
          className="opacity-0"
          onClick={() => setActiveTab("Events List")}
        >
          Events
        </button>
        <button
          id="menu-item"
          className="opacity-0"
          onClick={() => setActiveTab("Live Stream")}
        >
          Live Stream
        </button>

        <LogoutLink
          id="menu-item"
          className="opacity-0"
          postLogoutRedirectURL={postLogoutRedirectURL}
        >
          <LogoutIcon />
        </LogoutLink>
      </div>
    </div>
  );
};

export default DashHeader;
