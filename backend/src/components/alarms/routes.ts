import { Router } from 'express';
import { AlarmsController } from './controller';

const router = Router();
const controller = new AlarmsController();

router.route('').get(controller.getAlarms).post(controller.createAlarm);
router.route('/:id').get(controller.getAlarm).delete(controller.deleteAlarm);
router.route('/:id/details').get(controller.getAlarmDetails);

export default router;
