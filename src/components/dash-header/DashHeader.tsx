import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import LogoutIcon from "@mui/icons-material/Logout";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface DashProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const DashHeader: React.FC<DashProps> = ({ setActiveTab, activeTab }) => {
  const postLogoutRedirectURL = process.env.KINDE_POST_LOGOUT_REDIRECT_URL;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (tab: string) => {
    setActiveTab(tab);
    handleClose();
  };

  return (
    <AppBar className="sticky top-0 bg-customNavy">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={handleMenu}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          className="font-bigola"
        >
          {activeTab}
        </Typography>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleMenuItemClick("Create Event")}>
            <EditCalendarIcon sx={{ mr: 1 }} /> Create Event
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Upcoming Events")}>
            <EventIcon sx={{ mr: 1 }} /> Upcoming Events
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Past Events")}>
            <EventIcon sx={{ mr: 1 }} /> Past Events
          </MenuItem>
          {/*
          <MenuItem onClick={() => handleMenuItemClick("Edit Menu")}>
            <MenuBookIcon sx={{ mr: 1 }} /> Edit Menu
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Menu Items")}>
            <SportsBarIcon sx={{ mr: 1 }} /> Menu Items
          </MenuItem>
          */}
          <MenuItem onClick={() => handleMenuItemClick("Unread Messages")}>
            <MailIcon sx={{ mr: 1 }} /> Unread Messages
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("Read Messages")}>
            <MailIcon sx={{ mr: 1 }} /> Read Messages
          </MenuItem>
        </Menu>
        <LogoutLink postLogoutRedirectURL={postLogoutRedirectURL}>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            className="font-bigola"
          >
            Logout
          </Button>
        </LogoutLink>
      </Toolbar>
    </AppBar>
  );
};

export default DashHeader;
