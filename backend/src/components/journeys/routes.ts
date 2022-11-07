import { Router } from 'express';
import { JourneysController } from './controller';

const router = Router();
const controller = new JourneysController();

router.get('/search', controller.searchJourney);

export default router;
