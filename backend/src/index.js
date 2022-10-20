require("dotenv").config();

const { app } = require("./app");
const db = require("./config/db");
const logger = require("./config/logger");

db.authenticate()
  .then(() => {
    app.listen(5000, () => {
      require("./services/cronjob");
      logger.info("rmv-backend is listening on port 5000");
    });
  })
  .catch((err) => {
    logger.error(err);
  });
