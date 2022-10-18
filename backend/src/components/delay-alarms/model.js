const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const DelayAlarm = sequelize.define("DelayAlarm", {
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
});

module.exports = DelayAlarm;
