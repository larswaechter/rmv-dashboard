import { DataTypes } from "sequelize";
import sequelize from "../../config/db";

export const Alarm = sequelize.define("Alarm", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  journeyRef: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  station_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  smartmode: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  autoremove: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  telegram: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  discord: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export const AlarmHistory = sequelize.define("AlarmHistory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  journeyRef: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  station_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  scheduleHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
