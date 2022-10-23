import { DataTypes } from "sequelize";

import sequelize from "../../config/db";

const Alarm = sequelize.define("Alarm", {
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
  interval: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      is: /^[0-7]$/g,
    },
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
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const AlarmHistory = sequelize.define("AlarmHistory", {
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

Alarm.hasOne(AlarmHistory, {
  onDelete: "CASCADE",
  foreignKey: {
    allowNull: false,
  },
});

export { Alarm, AlarmHistory };
