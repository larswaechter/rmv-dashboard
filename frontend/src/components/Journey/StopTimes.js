import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import TrainIcon from "@mui/icons-material/Train";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import TagIcon from "@mui/icons-material/Tag";
import { orange } from "@mui/material/colors";

import { delayToColor } from "../../utils/helper";

const JourneyStopTimes = ({ stop }) => {
  const { arrival, departure, isFirst, isLast } = stop;
  const { track } = departure;

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
              arrival.delay > 0
                ? `${arrival.date.original || arrival.date.value} / ${
                    arrival.time.original || arrival.time.value
                  }`
                : ""
            }
            secondary={
              <>
                <span>{`${arrival.date.value} / ${arrival.time.value}`}</span>
                {arrival.delay !== 0 && (
                  <span
                    style={{
                      color: delayToColor(arrival.delay),
                      marginLeft: 8,
                    }}
                  >
                    {`${arrival.delay > 0 ? "+" : "-"}${arrival.delay} Min`}
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
              departure.delay > 0
                ? `${departure.date.original || departure.date.value} / ${
                    departure.time.original || departure.time.value
                  }`
                : ""
            }
            secondary={
              <>
                <span>{`${departure.date.value} / ${departure.time.value}`}</span>
                {departure.delay !== 0 && (
                  <span
                    style={{
                      color: delayToColor(departure.delay),
                      marginLeft: 8,
                    }}
                  >
                    {`${departure.delay > 0 ? "+" : "-"}${departure.delay} Min`}
                  </span>
                )}
              </>
            }
          ></ListItemText>
        </ListItem>
      )}
      {track.value && (
        <ListItem>
          <ListItemAvatar>
            <TagIcon />
          </ListItemAvatar>
          <ListItemText
            primary="Track"
            title={track.original}
            style={{
              color: track.orignial ? orange[900] : "",
            }}
            secondary={track.value}
          ></ListItemText>
        </ListItem>
      )}
    </List>
  );
};

export default JourneyStopTimes;
