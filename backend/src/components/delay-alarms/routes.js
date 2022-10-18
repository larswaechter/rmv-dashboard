const { Router } = require("express");
const DelayAlarmsController = require("./controller");

router = Router();

router
  .route("")
  .get(DelayAlarmsController.getAlarms)
  .post(DelayAlarmsController.createAlarm);

router
  .route("/:id")
  .get(DelayAlarmsController.getAlarm)
  .delete(DelayAlarmsController.deleteAlarm);

router.route("/:id/details").get(DelayAlarmsController.getAlarmDetails);

module.exports = router;
