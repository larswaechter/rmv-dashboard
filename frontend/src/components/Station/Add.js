import { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { createStation } from '../../services/station';
import { ModalStyle } from '../../utils/helper';

import StationSearch from './Search';

const StationAdd = ({ handleClose }) => {
  const [station, setStation] = useState(null);

  const handleSave = async () => {
    try {
      if (!station) return;
      const newStation = await createStation(station);
      handleClose(newStation);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={ModalStyle} component="form">
      <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={'16px'}>
        Add station
      </Typography>
      <Stack spacing={4}>
        <StationSearch handleChange={setStation} />
        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: '4px' }} onClick={() => handleClose(false)}>
            Close
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Stack>
    </Box>
  );
};

StationAdd.propTypes = {
  handleClose: PropTypes.func
};

export default StationAdd;
