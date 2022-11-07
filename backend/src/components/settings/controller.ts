import { Request, Response } from 'express';
import Cache from '../../config/cache';

import Logger from '../../config/logger';

import SettingsModel from './model';

export class SettingsController {
  async getSettings(req: Request, res: Response) {
    try {
      const settings = await SettingsModel.findAll();
      res.json(settings);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async getSetting(req: Request, res: Response) {
    try {
      const { key } = req.params;
      if (!key) return res.sendStatus(400);

      const setting = await SettingsModel.findOne({
        where: {
          key
        }
      });
      if (!setting) return res.sendStatus(404);

      res.json(setting);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async createSetting(req: Request, res: Response) {
    try {
      const setting = req.body;
      if (!setting) res.sendStatus(400);

      const newSetting = await SettingsModel.create(setting);

      res.status(201).json(newSetting);
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
      if (value === undefined) return res.sendStatus(400);

      const model = await SettingsModel.findOne({
        where: {
          key
        }
      });

      if (!model) return res.sendStatus(404);

      await SettingsModel.update(
        { value },
        {
          where: {
            key
          }
        }
      );

      Logger.debug(`Updating cache entry: ${key}`);
      Cache.set(key, value);

      res.sendStatus(204);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }
}
