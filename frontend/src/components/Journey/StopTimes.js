import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import TrainIcon from "@mui/icons-material/Train";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import TagIcon from "@mui/icons-material/Tag";
import { orange } from "@mui/material/colors";

import { delayToColor, getDelayInSeconds } from "../../utils/helper";

const JourneyStopTimes = ({ stop }) => {
  const { arrDate, depDate, arrTime, depTime, depTrack, isFirst, isLast } =
    stop;

  const arrDiff = getDelayInSeconds(arrDate, arrTime);
  const depDiff = getDelayInSeconds(depDate, depTime);

  return (
    <List dense disablePadding>
      {!isFirst && (
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
      {!isLast && (
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
      {depTrack.value && (
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
      )}
    </List>
  );
};

export default JourneyStopTimes;
