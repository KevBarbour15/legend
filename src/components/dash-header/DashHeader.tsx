import Link from "next/link";
import React, { useRef, useState } from "react";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";

import Event from "@mui/icons-material/Event";
import EditCalendar from "@mui/icons-material/EditCalendar";

import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MenuBook from "@mui/icons-material/MenuBook";
import SportsBar from "@mui/icons-material/SportsBar";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

//gsap imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface DashProps {
  setActiveTab: (tab: string) => void;
}

const DashHeader: React.FC<DashProps> = ({ setActiveTab }) => {
  const postLogoutRedirectURL = process.env.KINDE_POST_LOGOUT_REDIRECT_URL;
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Create Event", "Upcoming Events", "Past Events"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => setActiveTab(text)}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ),
        )}
      </List>
      <Divider />
      <List>
        {["Edit Menu", "Menu Items"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <LogoutLink postLogoutRedirectURL={postLogoutRedirectURL}>
                <ListItemIcon>
                  {index % 2 === 0 ? <MenuBook /> : <SportsBar />}
                </ListItemIcon>
              </LogoutLink>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Unread Messages", "Read Messages"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={"Logout"} />
        </ListItemButton>
      </ListItem>
    </Box>
  );

  return (
    <div className="fixed bottom-[25px] right-[25px]">
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Fab onClick={toggleDrawer(true)} variant="extended">
          Dashboard
        </Fab>
      </Box>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default DashHeader;
