import { IScheduleChange } from '../../services/cronjob';

export interface IBot {
  sendMessage(message: string);
  sendDelayNotifications(notifications: IScheduleChange[]);
}
