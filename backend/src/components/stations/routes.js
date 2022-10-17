const { Router } = require("express");

const UserController = require("./controller");

router = Router();

router
  .route("")
  .get(UserController.getStations)
  .post(UserController.createStation);

router.get("/search", UserController.searchStations);

router
  .route("/:id")
  .get(UserController.getStation)
  .delete(UserController.deleteStation);

router.get("/:id/departures", UserController.getStationDepartures);

module.exports = router;
