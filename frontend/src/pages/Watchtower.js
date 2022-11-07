import { useCallback, useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';

import AlarmAdd from '../components/Alarm/Add';
import AlarmCard from '../components/Alarm/Card';

import { getAlarms } from '../services/alarm';

const PagesWatchtower = () => {
  const [showModal, setShowModal] = useState(false);

  const [alarms, setAlarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getAlarms();
      setAlarms(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
      setAlarms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = useCallback((id) => {
    setAlarms((alarms) => alarms.filter((dept) => dept.id !== id));
  }, []);

  const handleUpdate = useCallback(
    (alarm) => {
      const idx = alarms.findIndex(({ id }) => id === alarm.id);
      const copy = alarms.slice();
      copy[idx] = alarm;
      setAlarms(copy);
    },
    [alarms]
  );

  const handleCloseModal = (newAlarm = null) => {
    if (newAlarm) setAlarms([...alarms, newAlarm]);
    setShowModal(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div style={{ textAlign: 'center', padding: '20vh 0px' }}>
        <CircularProgress />
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

  return (
    <div className="PagesWatchtower">
      <Typography variant="h5" component="h1" marginBottom={'16px'}>
        Watchtower
      </Typography>
      {alarms.length > 0 ? (
        <Grid container spacing={2}>
          {alarms.map((alarm, i) => (
            <Grid key={i} xs={4}>
              <AlarmCard alarm={alarm} afterDelete={handleDelete} afterUpdate={handleUpdate} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={() => setShowModal(true)}>
              Add
            </Button>
          }
        >
          No alarm created yet!
        </Alert>
      )}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowModal(true)}
      >
        <AddIcon />
      </Fab>
      <Modal
        open={showModal}
        onClose={() => handleCloseModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <AlarmAdd handleClose={handleCloseModal} />
        </>
      </Modal>
    </div>
  );
};

export default PagesWatchtower;
