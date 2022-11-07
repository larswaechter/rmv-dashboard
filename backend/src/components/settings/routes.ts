import { Router } from 'express';
import { SettingsController } from './controller';

const router = Router();
const controller = new SettingsController();

router.route('/').get(controller.getSettings).post(controller.createSetting);
router.route('/:key').get(controller.getSetting).patch(controller.updateSetting);

export default router;
