import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model
} from 'sequelize';

import db from '../../config/db';

class Station extends Model<InferAttributes<Station>, InferCreationAttributes<Station>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare stationId: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Station.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: 'Stations',
    sequelize: db
  }
);

export default Station;
