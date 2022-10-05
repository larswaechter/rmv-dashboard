import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TrainIcon from "@mui/icons-material/Train";
import TramIcon from "@mui/icons-material/Tram";
import SubwayIcon from "@mui/icons-material/Subway";
import CommuteIcon from "@mui/icons-material/Commute";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { visuallyHidden } from "@mui/utils";

import { deleteStation } from "../../services/station";
import JourneyDetails from "../Journey/Details";

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

const categoryToIcon = (category) => {
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

const headCells = [
  {
    id: "type",
    numberic: false,
    label: "Type",
  },
  {
    id: "direction",
    numeric: false,
    label: "Direction",
  },
  {
    id: "train",
    numeric: false,
    label: "Product",
  },
  {
    id: "date",
    numeric: true,
    label: "Departure Date",
  },
  {
    id: "time",
    numeric: true,
    label: "Departure Time",
  },
  {
    id: "track",
    numeric: true,
    label: "Track",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const Row = ({ row }) => {
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
        dep.direction.toLowerCase().includes(search)
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearch("")} edge="end">
                    <ClearIcon
                      color={search ? "primary" : "action"}
                      style={{ visibility: search ? "" : "hidden" }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
            <EnhancedTableHead
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
                  return <Row row={row} key={i} />;
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
