import { join } from "path";
import { Sequelize } from "sequelize";

const DB_NAME = process.env.DB_NAME || "db.sqlite";

const sequelize = new Sequelize({
  logging: false,
  dialect: "sqlite",
  storage: join(__dirname, `../../../data/${DB_NAME}`),
});

sequelize.sync();

export default sequelize;
