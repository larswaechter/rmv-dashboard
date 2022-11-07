import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';

import JourneyStop from './Stop';

import { searchJourney } from '../../services/journey';
import MapStops from '../Map/Stops';

const JourneyDetails = ({ journeyRef }) => {
  const [journey, setJourney] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeStep, setActiveStep] = useState(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await searchJourney(journeyRef);
      setJourney(data);
      setError(null);
      setActiveStep(data.nextStop);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getChip = (i) => {
    if (i < journey.nextStop)
      return <Chip title="Previous stop" label="Previous" color="warning" variant="outlined" />;

    if (i > journey.nextStop)
      return <Chip title="Upcoming stop" label="Upcoming" color="info" variant="outlined" />;

    return <Chip title="Current stop" label="Live •" color="success" variant="outlined" />;
  };

  useEffect(() => {
    fetchData();
  }, [journeyRef]);

  if (isLoading)
    return (
      <div style={{ textAlign: 'center', padding: '16px 0px' }}>
        <CircularProgress size={30} />
      </div>
    );

  if (error)
    return (
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
    );

  const { stops, nextStop } = journey;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {stops.map((stop, i) => {
              return (
                <Step key={stop.name}>
                  <StepLabel>{stop.name}</StepLabel>
                  <StepContent>
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 360,
                        bgcolor: 'background.paper'
                      }}
                    >
                      <JourneyStop stop={stop} />
                      <div>
                        <IconButton disabled={i === 0} onClick={handleBack}>
                          <KeyboardArrowUpIcon />
                        </IconButton>
                        <IconButton variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                          <KeyboardArrowDownIcon />
                        </IconButton>
                        {getChip(i)}
                        <IconButton
                          title="Go to current stop"
                          variant="contained"
                          onClick={() => setActiveStep(nextStop)}
                          sx={{ ml: 1 }}
                        >
                          {i !== nextStop && <GpsFixedIcon />}
                        </IconButton>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </Grid>
        <Grid item xs={8}>
          <MapStops stops={stops} activeStopIdx={activeStep} />
        </Grid>
      </Grid>
    </Box>
  );
};

JourneyDetails.propTypes = {
  journeyRef: PropTypes.string
};

export default JourneyDetails;
