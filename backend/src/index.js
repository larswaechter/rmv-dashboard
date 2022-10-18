require("dotenv").config();

const app = require("./app");
const db = require("./config/db");
const logger = require("./config/logger");

db.authenticate()
  .then(() => {
    app.listen(3000, () => {
      logger.info("rmv-backend is listening on port 3000");
    });
  })
  .catch((err) => {
    logger.error(err);
  });
