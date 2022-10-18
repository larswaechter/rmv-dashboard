const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

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
  autoremove: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Alarm;
