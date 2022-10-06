import { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import JourneyDetails from "../../Journey/Details";
import { categoryToIcon } from ".";

const StationBoardTableRow = ({ row }) => {
  const [open, setOpen] = useState(false);

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
          {categoryToIcon(row.catOut)}
        </TableCell>
        <TableCell>{row.direction}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell align="right">{row.date}</TableCell>
        <TableCell align="right">{row.time}</TableCell>
        <TableCell align="right">{row.track}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <JourneyDetails journeyRef={row.journeyRef} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default StationBoardTableRow;
