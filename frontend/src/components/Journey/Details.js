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
import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

import { searchJourney } from "../../services/journey";
import {
  delayToColor,
  getDelayInSeconds,
  parseDateTime,
} from "../../utils/helper";

const calcActiveStep = (stops) => {
  let idx = stops.length;
  const now = Date.now();

  for (let i = 0; i < stops.length - 1; i++) {
    const stop = stops[i];
    const { depDate, depTime } = stop;
    const depParsed = parseDateTime(depDate.value, depTime.value);

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
      setActiveStep(calcActiveStep(data.stops));
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

  const { stops } = journey;

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {stops.map(
          ({ name, arrDate, depDate, arrTime, depTime, depTrack }, i) => {
            const arrDiff = getDelayInSeconds(arrDate, arrTime);
            const depDiff = getDelayInSeconds(depDate, depTime);

            return (
              <Step key={name}>
                <StepLabel>{name}</StepLabel>
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
                            title={
                              arrDiff > 0
                                ? `${arrDate.original || arrDate.value} / ${
                                    arrTime.original || arrTime.value
                                  }`
                                : ""
                            }
                            secondary={
                              <>
                                <span>{`${arrDate.value} / ${arrTime.value}`}</span>
                                {arrDiff !== 0 && (
                                  <span
                                    style={{
                                      color: delayToColor(arrDiff),
                                      marginLeft: 8,
                                    }}
                                  >
                                    {`${arrDiff > 0 ? "+" : "-"}${arrDiff} Min`}
                                  </span>
                                )}
                              </>
                            }
                          ></ListItemText>
                        </ListItem>
                      )}
                      {i < stops.length - 1 && (
                        <ListItem>
                          <ListItemAvatar>
                            <DepartureBoardIcon />
                          </ListItemAvatar>
                          <ListItemText
                            primary="Departure"
                            title={
                              depDiff > 0
                                ? `${depDate.original || depDate.value} / ${
                                    depTime.original || depTime.value
                                  }`
                                : ""
                            }
                            secondary={
                              <>
                                <span>{`${depDate.value} / ${depTime.value}`}</span>
                                {depDiff !== 0 && (
                                  <span
                                    style={{
                                      color: delayToColor(depDiff),
                                      marginLeft: 8,
                                    }}
                                  >
                                    {`${depDiff > 0 ? "+" : "-"}${depDiff} Min`}
                                  </span>
                                )}
                              </>
                            }
                          ></ListItemText>
                        </ListItem>
                      )}
                      <ListItem>
                        <ListItemAvatar>
                          <TagIcon />
                        </ListItemAvatar>
                        <ListItemText
                          primary="Track"
                          title={depTrack.original}
                          style={{
                            color: depTrack.changed ? orange[900] : "",
                          }}
                          secondary={depTrack.value}
                        ></ListItemText>
                      </ListItem>
                    </List>
                  </Box>
                </StepContent>
              </Step>
            );
          }
        )}
      </Stepper>
    </Box>
  );
};

export default JourneyDetails;
