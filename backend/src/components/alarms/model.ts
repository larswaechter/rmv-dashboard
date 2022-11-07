import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  Model
} from 'sequelize';

import db from '../../config/db';

class Alarm extends Model<InferAttributes<Alarm>, InferCreationAttributes<Alarm>> {
  declare id: CreationOptional<number>;
  declare journeyRef: string;
  declare stationId: string;
  declare smartmode: boolean;
  declare interval: number;
  declare autoremove: boolean;
  declare telegram: boolean;
  declare discord: boolean;
  declare active: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Alarm.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    journeyRef: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    smartmode: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    interval: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        is: /^[0-7]$/g
      }
    },
    autoremove: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    telegram: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    discord: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: 'Alarms',
    sequelize: db
  }
);

class AlarmHistory extends Model<
  InferAttributes<AlarmHistory>,
  InferCreationAttributes<AlarmHistory>
> {
  declare id: CreationOptional<number>;
  declare alarmId: ForeignKey<Alarm['id']>;
  declare journeyRef: string;
  declare stationId: string;
  declare scheduleHash: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AlarmHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    journeyRef: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stationId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    scheduleHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: 'AlarmHistories',
    sequelize: db
  }
);

Alarm.hasOne(AlarmHistory, {
  onDelete: 'CASCADE',
  foreignKey: {
    allowNull: false,
    name: 'alarmId'
  }
});

export { Alarm, AlarmHistory };
