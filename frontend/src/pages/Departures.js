import * as React from "react";
import Snackbar from "@mui/material/Snackbar";

import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import Stationboard from "../components/Station/Board";
import StationAdd from "../components/Station/Add";
import { getDepartures } from "../services/api";

const PagesDepartures = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [showSnack, setShowSnack] = React.useState(false);

  const [stations, setStations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleCloseModal = (refetch = false) => {
    if (refetch) fetchData();
    setShowModal(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getDepartures();
    setStations(data);
    setIsLoading(false);
  };

  const handleDelete = (id) => {
    setStations(stations.filter((dept) => dept.id !== id));
    setShowSnack(true);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "20vh 0px" }}>
        <CircularProgress />
      </div>
    );

  return (
    <div className="PagesDepartures">
      <Typography variant="h5" component="h1" marginBottom={"16px"}>
        Departures
      </Typography>
      {stations.map((board, i) => (
        <Stationboard key={i} station={board} afterDelete={handleDelete} />
      ))}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 32, right: 32 }}
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

export default PagesDepartures;
