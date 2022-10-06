require("dotenv").config();

const app = require("./app");
const db = require("./config/db");
const logger = require("./config/logger");

db.serialize(() => {
  app.listen(8080, () => {
    logger.info("rmv-backend is listening on port 8080");
  });
});
