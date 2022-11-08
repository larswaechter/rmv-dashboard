import { useCallback, useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import Stationboard from '../components/Station/Board';
import StationAdd from '../components/Station/Add';
import PageWrapper from '../components/Utils/PageWrapper';

import { getStations } from '../services/station';

const PagesDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSnack, setShowSnack] = useState(false);

  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getStations();
      setStations(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
      setStations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = (newStation = null) => {
    if (newStation) setStations([...stations, newStation]);
    setShowModal(false);
  };

  const handleDelete = useCallback((id) => {
    setStations((stations) => stations.filter((dept) => dept.id !== id));
    setShowSnack(true);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageWrapper isLoading={isLoading} error={error} onRetry={fetchData}>
      <div className="PagesDashboard">
        <Typography variant="h5" component="h1" marginBottom={'16px'}>
          Dashboard
        </Typography>
        {stations.length ? (
          stations.map((station) => (
            <Stationboard key={station.id} station={station} afterDelete={handleDelete} />
          ))
        ) : (
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={() => setShowModal(true)}>
                Add
              </Button>
            }
          >
            No station created yet!
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
            <StationAdd handleClose={handleCloseModal} />
          </>
        </Modal>
        <Snackbar
          open={showSnack}
          onClose={() => setShowSnack(false)}
          autoHideDuration={3000}
          message="Station deleted"
        />
      </div>
    </PageWrapper>
  );
};

export default PagesDashboard;
