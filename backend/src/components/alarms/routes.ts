import { Router } from 'express';
import { AlarmsController } from './controller';

const router = Router();
const controller = new AlarmsController();

router.route('').get(controller.getAlarms).post(controller.createAlarm);
router.route('/:id').get(controller.getAlarm).delete(controller.deleteAlarm);
router.route('/:id/details').get(controller.getAlarmDetails);
router.route('/:id/pause').post(controller.pauseAlarm);
router.route('/:id/continue').post(controller.continueAlarm);

export default router;
