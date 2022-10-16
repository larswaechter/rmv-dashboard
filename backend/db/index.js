require("dotenv").config();

const fs = require("fs");
const { join } = require("path");

const db = require("../src/config/db");
const logger = require("../src/config/logger");

logger.info("Running seed");

const schema = fs.readFileSync(join(__dirname, "schema.sql"), {
  encoding: "utf-8",
});

db.serialize(() => {
  const queries = schema.split(";").filter((query) => query.length > 2);
  queries.forEach((query) => {
    logger.info("Runnig query");
    db.run(query, [], (err) => {
      if (err) throw err;
    });
  });
});
