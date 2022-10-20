import { Router } from "express";

import { StationsController } from "./controller";

const router = Router();
const controller = new StationsController();

router.route("").get(controller.getStations).post(controller.createStation);
router.get("/search", controller.searchStations);
router
  .route("/:id")
  .get(controller.getStation)
  .delete(controller.deleteStation);
router.get("/:id/departures", controller.getStationDepartures);

export default router;
