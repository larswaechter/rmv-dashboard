const { Router } = require("express");
const AlarmsController = require("./controller");

router = Router();

router
  .route("")
  .get(AlarmsController.getAlarms)
  .post(AlarmsController.createAlarm);

router
  .route("/:id")
  .get(AlarmsController.getAlarm)
  .delete(AlarmsController.deleteAlarm);

router.route("/:id/details").get(AlarmsController.getAlarmDetails);

module.exports = router;
