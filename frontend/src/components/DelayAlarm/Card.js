import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { getAlarmDetails } from "../../services/delayAlarm";

const DelayAlarmCard = ({ alarm }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchData();
  }, [alarm]);

  if (isLoading)
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "2vh 0px" }}>
          <CircularProgress size={30} />
        </div>
      </Card>
    );

  if (error)
    return (
      <Card>
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
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {details.product}
        </Typography>
        <Typography variant="h5" component="div">
          {details.stop.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
        <Typography variant="body2">{details.direction}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => fetchData()}>
          Refresh
        </Button>
        <Button size="small" color="error">
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default DelayAlarmCard;
