import { join } from "path";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  logging: false, // process.env.NODE_ENV === "develop",
  dialect: "sqlite",
  storage: join(__dirname, "../../../data/db.sqlite"),
});

sequelize.sync();

export default sequelize;
