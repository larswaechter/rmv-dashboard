require("dotenv").config();
const { exec } = require("child_process");

const app = require("./app");
const db = require("./config/db");
const logger = require("./config/logger");

const isDevEnv = process.env.NODE_ENV === "develop";

db.serialize(() => {
  if (!isDevEnv)
    exec("cd backend && npm run seed", (err, stdout, stderr) => {
      if (err) logger.error(err.message);
      if (stderr) logger.error(stderr);
    });

  app.listen(8080, () => {
    logger.info("rmv-backend is listening on port 8080");
  });
});
