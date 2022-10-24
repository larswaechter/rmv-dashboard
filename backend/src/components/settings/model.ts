import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
} from "sequelize";

import db from "../../config/db";

class Settings extends Model<
  InferAttributes<Settings>,
  InferCreationAttributes<Settings>
> {
  declare id: CreationOptional<number>;
  declare key: string;
  declare value: CreationOptional<string>;
  declare default: CreationOptional<boolean>;
  declare description: number;
  declare group: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Settings.init(
  {
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "Settings",
    sequelize: db,
  }
);

export default Settings;
