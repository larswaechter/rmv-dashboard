const app = require("./app");
const db = require("./db/connection");
const logger = require("./config/logger");

db.serialize(() => {
  app.listen(8080, () => {
    logger.info("rmv-backend is listening on port 8080");
  });
});
