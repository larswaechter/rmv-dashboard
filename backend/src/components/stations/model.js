const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Station = sequelize.define("Station", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  station_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Station;
