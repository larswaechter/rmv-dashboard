import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import SnackbarContent from "@mui/material/SnackbarContent";

import "./App.css";

import Navbar from "./components/Navbar";
import { Drawer, DrawerHeader, drawerWidth } from "./components/Drawer";

import Router from "./pages/routes";

import useWebsocketProvider from "./utils/hooks/useWebsocketProvider";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const onFocus = () => {
  document.title = "RMV Dashboard";
};

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackContent, setSnackContent] = useState([]);
  const navigate = useNavigate();

  const { eventEmitter } = useWebsocketProvider();

  useEffect(() => {
    window.addEventListener("focus", onFocus);

    eventEmitter.subscribe("message/cronjob-timetable", "App", (msg) => {
      console.log(msg);
      setSnackContent(msg);
      setSnackOpen(true);
      if (!document.hasFocus()) document.title = "• RMV Dashboard";
    });

    return () => {
      eventEmitter.unsubscribe("message", "App");
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const handleSnackClose = (e, reason) => {
    if (reason === "clickaway") return;
    setSnackOpen(false);
  };

  const action = (
    <Button
      color="primary"
      size="small"
      onClick={() => {
        setSnackOpen(false);
        navigate("/watchtower");
      }}
    >
      VIEW
    </Button>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar open={drawerOpen} handleDrawerOpen={() => setDrawerOpen(true)} />
      <Drawer
        open={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
      />
      <Main open={drawerOpen}>
        <DrawerHeader />
        <Router />
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackOpen}
          onClose={handleSnackClose}
          autoHideDuration={10000}
        >
          <SnackbarContent
            message={
              <>
                <div>
                  There are {snackContent.length} schedule changes:
                  <ul>
                    {snackContent.map((item, i) => (
                      <li key={i}>
                        {item.product.name} - {item.direction.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            }
            action={action}
          />
        </Snackbar>
      </Main>
    </Box>
  );
};

export default App;
