import { Request, Response } from 'express';

import Logger from '../../config/logger';

import { RMVApi } from '../rmv/api';
import { Journey } from '../rmv/models/Journey';

import { Alarm } from './model';

export class AlarmsController {
  async getAlarms(req: Request, res: Response) {
    try {
      const alarms = await Alarm.findAll();

      res.json(alarms);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async getAlarm(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const alarm = await Alarm.findByPk(+id);
      if (!alarm) return res.sendStatus(404);

      res.json(alarm);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async getAlarmDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const alarm = await Alarm.findByPk(+id);
      if (!alarm) return res.sendStatus(404);

      const journey = await RMVApi.getJourneyDetails(alarm.getDataValue('journeyRef'));
      const parsed = Journey.ofJourneyDetails(journey);

      parsed['stop'] = parsed.stops.find((stop) => stop.id === alarm.stationId);

      delete parsed.stops;

      res.json(parsed);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async pauseAlarm(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const alarm = await Alarm.findByPk(+id);
      if (!alarm) return res.sendStatus(404);

      await alarm.update({
        paused: true
      });

      res.sendStatus(204);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async resumeAlarm(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const alarm = await Alarm.findByPk(+id);
      if (!alarm) return res.sendStatus(404);

      await alarm.update({
        paused: false
      });

      res.sendStatus(204);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async createAlarm(req: Request, res: Response) {
    try {
      const alarm = req.body;
      if (!alarm) res.sendStatus(400);

      const newAlarm = await Alarm.create(alarm);

      res.status(201).json(newAlarm);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }

  async deleteAlarm(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.sendStatus(400);

      const alarm = await Alarm.findByPk(+id);
      if (!alarm) return res.sendStatus(404);

      await Alarm.destroy({
        where: {
          id
        }
      });

      res.sendStatus(204);
    } catch (err) {
      Logger.error(err.stack || err);
      res.sendStatus(500);
    }
  }
}
