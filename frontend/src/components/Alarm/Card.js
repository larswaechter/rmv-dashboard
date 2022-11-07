import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { resumeAlarm, deleteAlarm, getAlarmDetails, pauseAlarm } from '../../services/alarm';
import JourneyStop from '../Journey/Stop';

const AlarmCard = ({ alarm, afterUpdate, afterDelete }) => {
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

  const onPause = async () => {
    try {
      await pauseAlarm(alarm.id);
      afterUpdate({
        ...alarm,
        paused: true
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onContinue = async () => {
    try {
      await resumeAlarm(alarm.id);
      afterUpdate({
        ...alarm,
        paused: false
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      if (window.confirm('Delete item?')) {
        await deleteAlarm(alarm.id);
        afterDelete(alarm.id);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  const getTimeChip = () => {
    const { stop } = details;

    if (stop.departure?.delay || stop.arrival?.delay)
      return <Chip label="DELAY" color="error" variant="outlined" />;

    if (stop.departure?.track.original)
      return <Chip label="TRACK CHANGE" color="warning" variant="outlined" />;

    return <Chip label="ONTIME" color="success" variant="outlined" />;
  };

  useEffect(() => {
    fetchData();
  }, [alarm.id]);

  if (isLoading)
    return (
      <Card
        sx={{
          minHeight: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CardContent>
          <CircularProgress />
        </CardContent>
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

  const { active, interval, telegram, discord, paused } = alarm;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {details.stop.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {details.products[0].name} {details.directions[0].value}
        </Typography>
        <JourneyStop stop={details.stop} />
        {!active && (
          <Alert
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
            severity="success"
            variant="outlined"
            action={
              <Button color="inherit" size="small" onClick={handleDelete}>
                DELETE
              </Button>
            }
          >
            Alarm finished
          </Alert>
        )}
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {getTimeChip()}
          {paused && (
            <Chip
              label="PAUSED"
              sx={{ marginLeft: 1 }}
              color="warning"
              variant="outlined"
              title="Notifications paused"
            />
          )}
          {interval > 0 && (
            <Chip
              label={`Interval: ${interval}`}
              sx={{ marginLeft: 1 }}
              color="info"
              variant="outlined"
              title="Interval enabled"
            />
          )}
          {telegram && (
            <Chip
              label="TELEGRAM"
              sx={{ marginLeft: 1 }}
              color="info"
              variant="outlined"
              title="Telegram notification enabled"
            />
          )}
          {discord && (
            <Chip
              label="DISCORD"
              sx={{ marginLeft: 1 }}
              color="info"
              variant="outlined"
              title="Discord notification enabled"
            />
          )}
        </div>
        <div>
          <IconButton size="small" onClick={() => fetchData()} title="Reload">
            <ReplayIcon />
          </IconButton>
          {paused ? (
            <IconButton size="small" onClick={onContinue} title="Resume">
              <PlayArrowIcon />
            </IconButton>
          ) : (
            <IconButton size="small" onClick={onPause} title="Pause">
              <PauseIcon />
            </IconButton>
          )}
          <IconButton size="small" color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
};

AlarmCard.propTypes = {
  alarm: PropTypes.object,
  afterUpdate: PropTypes.func,
  afterDelete: PropTypes.func
};

export default AlarmCard;
