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
  telegram: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  discord: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Alarm;
