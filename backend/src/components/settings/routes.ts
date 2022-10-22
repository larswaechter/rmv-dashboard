import { Router } from "express";
import { SettingsController } from "./controller";

const router = Router();
const controller = new SettingsController();

router.get("/", controller.getSettings);
router.patch("/:key", controller.updateSetting);

export default router;
