require("dotenv").config();

import { server } from "./app";
import db from "./config/db";
import logger from "./config/logger";

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
