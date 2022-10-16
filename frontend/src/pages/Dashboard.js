import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import Stationboard from "../components/Station/Board";
import StationAdd from "../components/Station/Add";
import { getDepartures } from "../services/station";

const PagesDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSnack, setShowSnack] = useState(false);

  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCloseModal = (refetch = false) => {
    if (refetch) fetchData();
    setShowModal(false);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getDepartures();
      setStations(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setStations(stations.filter((dept) => dept.id !== id));
    setShowSnack(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "20vh 0px" }}>
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
    <div className="PagesDashboard">
      <Typography variant="h5" component="h1" marginBottom={"16px"}>
        Dashboard
      </Typography>
      {stations.length ? (
        stations.map((board, i) => (
          <Stationboard key={i} station={board} afterDelete={handleDelete} />
        ))
      ) : (
        <Alert severity="info">This is an info alert — check it out!</Alert>
      )}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
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
  );
};

export default PagesDashboard;
