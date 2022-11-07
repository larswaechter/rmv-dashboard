import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

const headCells = [
  {
    id: 'category',
    numberic: false,
    label: 'Type'
  },
  {
    id: 'direction',
    numeric: false,
    label: 'Direction'
  },
  {
    id: 'name',
    numeric: false,
    label: 'Product'
  },
  {
    id: 'date',
    numeric: true,
    label: 'Departure Date'
  },
  {
    id: 'time',
    numeric: true,
    label: 'Departure Time'
  },
  {
    id: 'track',
    numeric: true,
    label: 'Track'
  }
];

const StationBoardTableHead = ({ order, orderBy, onRequestSort }) => {
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
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

StationBoardTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func
};

export default StationBoardTableHead;
