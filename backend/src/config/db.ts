import { join } from "path";
import { Sequelize } from "sequelize";

const DB_NAME = process.env.DB_NAME || "db.sqlite";

const db = new Sequelize({
  logging: false,
  dialect: "sqlite",
  storage: join(__dirname, `../../../data/${DB_NAME}`),
});

export default db;
