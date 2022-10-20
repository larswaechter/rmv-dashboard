import { useEffect, useState, forwardRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SnackbarContent from "@mui/material/SnackbarContent";

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
          onClose={() => setSnackOpen(false)}
        >
          <SnackbarContent
            message={
              <>
                <div>
                  Watchtower: There are {snackContent.length} schedule changes
                  in:
                  <ul>
                    {snackContent.map((item, i) => (
                      <li key={i}>
                        {item.product} - {item.direction}
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
