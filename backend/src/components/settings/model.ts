import { DataTypes } from "sequelize";
import sequelize from "../../config/db";

const Settings = sequelize.define("Settings", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  default: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Settings;
