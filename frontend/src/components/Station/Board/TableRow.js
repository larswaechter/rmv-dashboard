import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RemoveIcon from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import { orange } from "@mui/material/colors";

import JourneyDetails from "../../Journey/Details";
import { categoryToIcon } from ".";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StationBoardTableRow = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { category, direction, name, departure, journeyRef, notes } = row;
  const { date, time, track } = departure;

  return (
    <>
      <TableRow hover tabIndex={-1} key={row.name}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {categoryToIcon(category)}
        </TableCell>
        <TableCell>{direction}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell
          title={date.original ? date.original : ""}
          align="right"
          style={{ color: date.original ? orange[900] : "" }}
        >
          {date.value}
        </TableCell>
        <TableCell
          title={time.original ? time.original : ""}
          align="right"
          style={{ color: time.original ? orange[900] : "" }}
        >
          {time.value}
        </TableCell>
        <TableCell
          title={track.original ? track.original : ""}
          align="right"
          style={{ color: track.original ? orange[900] : "" }}
        >
          {track.value}
        </TableCell>
        <TableCell>
          <IconButton size="small" onClick={() => setModalOpen(true)}>
            <InfoIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <JourneyDetails journeyRef={journeyRef} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {direction}
          </Typography>
          <List>
            {Array.isArray(notes) &&
              notes.map((note, i) => (
                <ListItem key={i}>
                  <ListItemIcon>
                    <RemoveIcon />
                  </ListItemIcon>
                  <ListItemText primary={note} />
                </ListItem>
              ))}
          </List>
          <Alert
            severity="info"
            style={{ whiteSpace: "nowrap" }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(journeyRef);
                }}
              >
                Copy
              </Button>
            }
          >
            <AlertTitle>JourneyRef</AlertTitle>
            {journeyRef}
          </Alert>
          <Button
            onClick={() => setModalOpen(false)}
            style={{ marginLeft: "auto", display: "block" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default StationBoardTableRow;
