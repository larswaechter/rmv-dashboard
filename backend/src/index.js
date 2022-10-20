require("dotenv").config();

const { server } = require("./app");
const db = require("./config/db");
const logger = require("./config/logger");

db.authenticate()
  .then(() => {
    server.listen(5000, () => {
      require("./services/cronjob");
      logger.info("rmv-backend is listening on port 5000");
    });
  })
  .catch((err) => {
    logger.error(err);
  });
