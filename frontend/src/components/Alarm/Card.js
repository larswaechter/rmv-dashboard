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

import { deleteAlarm, getAlarmDetails } from "../../services/alarm";
import JourneyStopTimes from "../Journey/StopTimes";

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
      await deleteAlarm(alarm.id);
      afterDelete(alarm.id);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [alarm]);

  if (isLoading)
    return (
      <Card
        sx={{
          minHeight: 415,
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
      <Card sx={{ minHeight: 415 }}>
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
    <Card sx={{ minHeight: 415 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {details.product}
        </Typography>
        <Typography variant="h5" component="div">
          {details.stop.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Direction: {details.direction}
        </Typography>
        <JourneyStopTimes stop={details.stop} />
      </CardContent>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <CardActions>
          <IconButton size="small" onClick={() => fetchData()}>
            <ReplayIcon />
          </IconButton>
          <IconButton size="small" color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </div>
    </Card>
  );
};

export default AlarmCard;
