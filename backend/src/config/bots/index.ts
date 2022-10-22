import { IDelayAlarm } from "../../services/cronjob";

export interface IBot {
  sendMessage(message: string);
  sendDelayNotifications(notifications: IDelayAlarm[]);
}
