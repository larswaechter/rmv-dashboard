import { useEffect, useState, forwardRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import Navbar from "./components/Navbar";
import { Drawer, DrawerHeader, drawerWidth } from "./components/Drawer";
import JourneyStopTimes from "./components/Journey/StopTimes";

import Router from "./pages/routes";

import useWebsocketProvider from "./utils/hooks/useWebsocketProvider";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

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

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackContent, setSnackContent] = useState({ title: "", data: [] });

  const { eventEmitter } = useWebsocketProvider();

  useEffect(() => {
    eventEmitter.subscribe("message/cronjob-timetable", "App", (msg) => {
      console.log(msg);
      setSnackContent({ title: msg.title, data: msg.changes });
      setSnackOpen(true);
    });

    return () => eventEmitter.unsubscribe("message", "App");
  }, []);

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
      </Main>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackOpen}
        autoHideDuration={30000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert severity="warning">
          <AlertTitle>{snackContent.title}</AlertTitle>
          {snackContent.data.map(({ stop }, i) => (
            <JourneyStopTimes key={i} stop={stop} />
          ))}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
