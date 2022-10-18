const { join } = require("path");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  logging: false, // process.env.NODE_ENV === "develop",
  dialect: "sqlite",
  storage: join(__dirname, "../../../data/db.sqlite"),
});

sequelize.sync();

module.exports = sequelize;
