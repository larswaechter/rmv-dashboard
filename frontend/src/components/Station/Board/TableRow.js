import { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { orange } from "@mui/material/colors";

import JourneyDetails from "../../Journey/Details";
import { categoryToIcon } from ".";

const StationBoardTableRow = ({ row }) => {
  const [open, setOpen] = useState(false);

  const { category, direction, name, date, time, track, journeyRef } = row;

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
          title={date.changed ? date.original : ""}
          align="right"
          style={{ color: date.changed ? orange[900] : "" }}
        >
          {date.value}
        </TableCell>
        <TableCell
          title={time.changed ? time.original : ""}
          align="right"
          style={{ color: time.changed ? orange[900] : "" }}
        >
          {time.value}
        </TableCell>
        <TableCell
          title={track.changed ? track.original : ""}
          align="right"
          style={{ color: track.changed ? orange[900] : "" }}
        >
          {track.value}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <JourneyDetails journeyRef={journeyRef} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default StationBoardTableRow;
