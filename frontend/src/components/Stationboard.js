import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

export default function StationBoard() {
  const { isLoading, error, data } = useQuery(["stationboards"], () =>
    fetch("http://localhost:8080/stationboards").then((res) => res.json())
  );

  if (isLoading || error) return <CircularProgress />;

  console.log(data.DepartureBoard.Departure.length);

  return (
    <div>
      <Typography variant="h6" component="h2" marginBottom={"8px"}>
        Oslo
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Direction</TableCell>
              <TableCell align="right">Train</TableCell>
              <TableCell align="right">Depature Date</TableCell>
              <TableCell align="right">Depature Time</TableCell>
              <TableCell align="right">Track</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.DepartureBoard.Departure.map((row) => (
              <TableRow
                key={row.direction}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.direction}
                </TableCell>
                <TableCell align="right">
                  {row.name} ({row.trainNumber})
                </TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.time}</TableCell>
                <TableCell align="right">{row.track}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
