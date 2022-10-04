import * as React from "react";
import { useNavigate } from "react-router-dom";

import MUIDrawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RouteIcon from "@mui/icons-material/Route";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export const drawerWidth = 240;

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const Drawer = ({ open, handleDrawerClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <MUIDrawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem key="dashboard" disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem key="departures" disablePadding>
          <ListItemButton onClick={() => navigate("/departures")}>
            <ListItemIcon>
              <DepartureBoardIcon />
            </ListItemIcon>
            <ListItemText primary="Departures" />
          </ListItemButton>
        </ListItem>
        <ListItem key="tripsearch" disablePadding>
          <ListItemButton onClick={() => navigate("/tripsearch")}>
            <ListItemIcon>
              <RouteIcon />
            </ListItemIcon>
            <ListItemText primary="Trips" />
          </ListItemButton>
        </ListItem>
        <ListItem key="locationsearch" disablePadding>
          <ListItemButton onClick={() => navigate("/locationsearch")}>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Locations" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem key="settings" disablePadding>
          <ListItemButton onClick={() => navigate("/settings")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </MUIDrawer>
  );
};
