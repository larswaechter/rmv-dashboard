import { useState, useMemo } from "react";
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
import CommuteIcon from "@mui/icons-material/Commute";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import StationBoardTableRow from "./TableRow";
import StationBoardTableHead from "./TableHead";
import { deleteStation } from "../../../services/station";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
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
    default:
      return <TrainIcon titleAccess={category} />;
  }
};

const StationBoard = ({ station, afterDelete }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);

  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const open = Boolean(anchorEl);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
    await deleteStation(station.id);
    afterDelete(station.id);
  };

  const departures = useMemo(() => {
    let clone = station.departures.slice();
    if (category)
      clone = station.departures.filter((dep) => dep.catOut === category);
    if (search)
      clone = clone.filter((dep) =>
        dep.direction?.toLowerCase().includes(search)
      );

    return clone;
  }, [station, category, search]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - departures.length) : 0;

  const categories = Array.from(
    new Set(
      station.departures
        .filter((dep) => dep.catOut.length)
        .map((dep) => dep.catOut)
        .sort()
    )
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
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
          />
          <Tooltip title="Filter Type">
            <IconButton size="small" onClick={openMenu}>
              <FilterAltIcon color={category ? "primary" : "action"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={handleDelete}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
          <Menu
            id="basic-menu"
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
            {categories.map((category) => (
              <MenuItem
                key={category}
                onClick={() => handleMenuSelect(category)}
              >
                <div style={{ marginRight: 10 }}>
                  {categoryToIcon(category)}
                </div>
                {category}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
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
              rowCount={departures.length}
            />
            <TableBody>
              {departures
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
          count={departures.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default StationBoard;
