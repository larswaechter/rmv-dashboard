import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteIcon from "@mui/icons-material/Delete";
import Chip from "@mui/material/Chip";

import { deleteAlarm, getAlarmDetails } from "../../services/alarm";
import JourneyStopTimes from "../Journey/StopTimes";
import { hasStopDelay } from "../../utils/helper";

const AlarmCard = ({ alarm, afterDelete }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(details);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getAlarmDetails(alarm.id);
      setDetails(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
      setDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Delete item?")) {
        await deleteAlarm(alarm.id);
        afterDelete(alarm.id);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  const getChip = () => {
    if (hasStopDelay(details.stop))
      return <Chip label="DELAY" color="error" variant="outlined" />;

    if (details.stop.departure.track.original)
      return <Chip label="TRACK CHANGE" color="warning" variant="outlined" />;

    return <Chip label="ONTIME" color="success" variant="outlined" />;
  };

  useEffect(() => {
    fetchData();
  }, [alarm]);

  if (isLoading)
    return (
      <Card
        sx={{
          minHeight: 390,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card sx={{ minHeight: 390 }}>
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
      </Card>
    );

  return (
    <Card sx={{ minHeight: 390 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {details.stop.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {details.products[0].name} {details.direction}
        </Typography>
        <JourneyStopTimes stop={details.stop} />
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {getChip()}
          {alarm.telegram && (
            <Chip
              label="TELEGRAM"
              sx={{ marginLeft: 1 }}
              color="info"
              variant="outlined"
              title="Notification enabled"
            />
          )}
          {alarm.discord && (
            <Chip
              label="DISCORD"
              sx={{ marginLeft: 1 }}
              color="info"
              variant="outlined"
              title="Notification enabled"
            />
          )}
        </div>
        <div>
          <IconButton size="small" onClick={() => fetchData()}>
            <ReplayIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
};

export default AlarmCard;
