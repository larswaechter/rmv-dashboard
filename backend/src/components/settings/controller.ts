import { Request, Response } from "express";
import Cache from "../../config/cache";

import Logger from "../../config/logger";

import SettingsModel from "./model";

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    try {
      const settings = SettingsModel.findAll();
      res.json(settings);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async updateSetting(req: Request, res: Response) {
    try {
      const { key } = req.params;
      if (!key) return res.sendStatus(400);

      const { value } = req.body;
      if (!value) res.sendStatus(400);

      const model = await SettingsModel.findOne({
        where: {
          key,
        },
      });

      if (!model) res.sendStatus(404);

      await SettingsModel.update(
        { value },
        {
          where: {
            key,
          },
        }
      );

      Logger.info(`Updating cache entry: ${key}`);
      Cache.set(key, value);

      res.sendStatus(204);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }
}
