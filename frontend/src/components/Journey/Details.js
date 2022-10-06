import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import CircularProgress from "@mui/material/CircularProgress";
import TrainIcon from "@mui/icons-material/Train";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import TagIcon from "@mui/icons-material/Tag";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { orange } from "@mui/material/colors";

import { searchJourney } from "../../services/journey";
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

const parseDateTime = (date, time) => {
  const [arrYear, arrMonth, arrDay] = date.split("-");
  const [arrHours, arrMin, arrSec] = time.split(":");

  return new Date(
    +arrYear,
    +arrMonth - 1,
    +arrDay,
    +arrHours,
    +arrMin,
    +arrSec
  );
};

const hasRealtimeValue = (value, rt) => rt !== undefined && rt !== value;

const getRealtimeValue = (value, rt) =>
  hasRealtimeValue(value, rt) ? rt : value;

const calcActiveStep = (stops) => {
  let idx = stops.length;
  const now = Date.now();

  for (let i = 0; i < stops.length - 1; i++) {
    const stop = stops[i];
    const { depDate, depTime, rtDepDate, rtDepTime } = stop;

    let depParsed;

    if (rtDepDate && rtDepTime)
      depParsed = parseDateTime(rtDepDate, rtDepTime).valueOf();
    else depParsed = parseDateTime(depDate, depTime).valueOf();

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
  const [activeStep, setActiveStep] = useState(8);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await searchJourney(journeyRef);
      setJourney(data);
      setError(null);
      setActiveStep(calcActiveStep(data.Stops.Stop));
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
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

  const { Stops } = journey;

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {Stops.Stop.map((stop, i) => (
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
                <List>
                  {i > 0 && (
                    <ListItem>
                      <ListItemAvatar>
                        <TrainIcon />
                      </ListItemAvatar>
                      <ListItemText
                        primary="Arrival"
                        style={{
                          color:
                            hasRealtimeValue(stop.arrDate, stop.rtArrDate) ||
                            hasRealtimeValue(stop.arrTime, stop.rtArrTime)
                              ? orange[900]
                              : "",
                        }}
                        secondary={`${getRealtimeValue(
                          stop.arrDate,
                          stop.rtArrDate
                        )} / ${getRealtimeValue(stop.arrTime, stop.rtArrTime)}`}
                      ></ListItemText>
                    </ListItem>
                  )}
                  {i < Stops.Stop.length - 1 && (
                    <ListItem>
                      <ListItemAvatar>
                        <DepartureBoardIcon />
                      </ListItemAvatar>
                      <ListItemText
                        primary="Departure"
                        style={{
                          color:
                            hasRealtimeValue(stop.depDate, stop.rtDepDate) ||
                            hasRealtimeValue(stop.depTime, stop.rtDepTime)
                              ? orange[900]
                              : "",
                        }}
                        secondary={`${getRealtimeValue(
                          stop.depDate,
                          stop.rtDepDate
                        )} / ${getRealtimeValue(stop.depTime, stop.rtDepTime)}`}
                      ></ListItemText>
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemAvatar>
                      <TagIcon />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Track"
                      style={{
                        color: hasRealtimeValue(stop.depTrack, stop.rtDepTrack)
                          ? orange[900]
                          : "",
                      }}
                      secondary={getRealtimeValue(
                        stop.depTrack,
                        stop.rtDepTrack
                      )}
                    ></ListItemText>
                  </ListItem>
                </List>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default JourneyDetails;
