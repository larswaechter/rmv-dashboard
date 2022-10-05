import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsRailwayIcon from "@mui/icons-material/DirectionsRailway";
import GitHubIcon from "@mui/icons-material/GitHub";
import InfoIcon from "@mui/icons-material/Info";

import { drawerWidth } from "./Drawer";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Navbar = ({ open, handleDrawerOpen }) => {
  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <DirectionsRailwayIcon
          sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
        />
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          RMV Dashboard
        </Typography>
        <IconButton
          color="inherit"
          href="https://github.com/larswaechter/rmv-dashboard"
          target="_blank"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton
          color="inherit"
          href="https://opendata.rmv.de/site/start.html"
          target="_blank"
        >
          <InfoIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
