import { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TrainIcon from "@mui/icons-material/Train";
import TramIcon from "@mui/icons-material/Tram";
import SubwayIcon from "@mui/icons-material/Subway";
import ReplayIcon from "@mui/icons-material/Replay";
import DirectionsRailwayIcon from "@mui/icons-material/DirectionsRailway";
import CommuteIcon from "@mui/icons-material/Commute";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import StationBoardTableRow from "./TableRow";
import StationBoardTableHead from "./TableHead";

import { deleteStation, getStationDepartures } from "../../../services/station";

const descendingComparator = (a, b, orderBy) => {
  const valA = typeof a[orderBy] === "object" ? a[orderBy].value : a[orderBy];
  const valB = typeof b[orderBy] === "object" ? b[orderBy].value : b[orderBy];

  if (valB < valA) return -1;
  if (valB > valA) return 1;
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const categoryToIcon = (category) => {
  switch (category) {
    case "Bus":
      return <DirectionsBusIcon titleAccess={category} />;
    case "U-Bahn":
      return <SubwayIcon titleAccess={category} />;
    case "Tram":
      return <TramIcon titleAccess={category} />;
    case "ICE":
      return <DirectionsRailwayIcon titleAccess={category} />;
    default:
      return <TrainIcon titleAccess={category} />;
  }
};

const StationBoard = ({ station, afterDelete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [departures, setDepartures] = useState([]);
  const [error, setError] = useState(null);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("time");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const [datetime, setDatetime] = useState(dayjs());

  const open = Boolean(anchorEl);

  const fetchData = async () => {
    try {
      const date = dayjs(datetime).format("YYYY-MM-DD");
      const time = dayjs(datetime).format("HH:mm");

      setIsLoading(true);
      const data = await getStationDepartures(station.id, date, time);
      setDepartures(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [station]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (category) => {
    if (category) setCategory(category);
    else setCategory("");
    closeMenu();
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Delete station?")) {
        await deleteStation(station.id);
        afterDelete(station.id);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  const departuresMemo = useMemo(() => {
    let clone = departures.slice();
    const lSearch = search.toLowerCase();

    if (category) clone = departures.filter((dep) => dep.category === category);
    if (lSearch)
      clone = clone.filter(
        (dep) =>
          dep.direction?.toLowerCase().includes(lSearch) ||
          dep.name?.toLowerCase().includes(lSearch)
      );

    return clone;
  }, [departures, category, search]);

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - departuresMemo.length)
      : 0;

  const categories = Array.from(
    new Set(
      departures
        .filter((dep) => dep.products[0].catOut.length)
        .map((dep) => dep.products[0].catOut)
        .sort()
    )
  );

  const Head = (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {station.name}
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        sx={{ marginRight: 1 }}
      />
      <DateTimePicker
        label="Departure"
        value={datetime}
        ampm={false}
        onChange={(val) => setDatetime(val)}
        onAccept={() => fetchData()}
        inputFormat="DD.MM HH:mm"
        renderInput={(params) => (
          <TextField sx={{ width: 290 }} size="small" {...params} />
        )}
      />
      <Tooltip title="Filter Type">
        <IconButton size="small" onClick={openMenu}>
          <FilterAltIcon color={category ? "primary" : "action"} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Refresh">
        <IconButton size="small" onClick={fetchData}>
          <ReplayIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" onClick={handleDelete}>
          <DeleteIcon color="error" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem key="all" onClick={() => handleMenuSelect()}>
          <CommuteIcon style={{ marginRight: 10 }} /> All
        </MenuItem>
        {categories.map((category, i) => (
          <MenuItem key={i} onClick={() => handleMenuSelect(category)}>
            <div style={{ marginRight: 10 }}>{categoryToIcon(category)}</div>
            {category}
          </MenuItem>
        ))}
      </Menu>
    </Toolbar>
  );

  if (isLoading)
    return (
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          {Head}
          <div style={{ textAlign: "center", padding: "4vh 0px" }}>
            <CircularProgress />
          </div>
        </Paper>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          {Head}
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => fetchData()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Paper>
      </Box>
    );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {Head}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <StationBoardTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={departuresMemo.length}
            />
            <TableBody>
              {departuresMemo
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return <StationBoardTableRow row={row} key={i} />;
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={departuresMemo.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, val) => setPage(val)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default StationBoard;
