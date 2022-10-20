import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

import JourneyStopTimes from "./StopTimes";

import { searchJourney } from "../../services/journey";
import { parseDateTime } from "../../utils/helper";
import { IconButton } from "@mui/material";

const calcActiveStep = (stops) => {
  let idx = stops.length;
  const now = Date.now();

  for (let i = 0; i < stops.length - 1; i++) {
    const stop = stops[i];
    const { departure } = stop;
    const { date, time } = departure;

    const depParsed = parseDateTime(date.value, time.value);

    // Next stop
    if (now < depParsed) {
      idx = i;
      break;
    }
  }

  return idx;
};

const JourneyDetails = ({ journeyRef }) => {
  const [journey, setJourney] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  const [activeStepLive, setActiveStepLive] = useState(0);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await searchJourney(journeyRef);
      setJourney(data);
      setError(null);

      const active = calcActiveStep(data.stops);
      setActiveStep(active);
      setActiveStepLive(active);
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
    if (i < activeStepLive)
      return (
        <Chip
          title="Previous stop"
          label="Previous"
          color="warning"
          variant="outlined"
        />
      );

    if (i > activeStepLive)
      return (
        <Chip
          title="Upcoming stop"
          label="Upcoming"
          color="info"
          variant="outlined"
        />
      );

    return (
      <Chip
        title="Current stop"
        label="Live •"
        color="success"
        variant="outlined"
      />
    );
  };

  useEffect(() => {
    fetchData();
  }, [journeyRef]);

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "16px 0px" }}>
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

  const { stops } = journey;

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {stops.map((stop, i) => {
          return (
            <Step key={stop.name}>
              <StepLabel>{stop.name}</StepLabel>
              <StepContent>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <JourneyStopTimes stop={stop} />
                  <div>
                    <IconButton disabled={i === 0} onClick={handleBack}>
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mr: 1 }}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                    {getChip(i)}
                    <IconButton
                      title="Go to current stop"
                      variant="contained"
                      onClick={() => setActiveStep(activeStepLive)}
                      sx={{ ml: 1 }}
                    >
                      {i !== activeStepLive && <GpsFixedIcon />}
                    </IconButton>
                  </div>
                </Box>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default JourneyDetails;
