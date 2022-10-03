const db = require("./connection");
const logger = require("../config/logger");

const findAll = (cb) => {
  db.all("SELECT * FROM lorem", (err, rows) => {
    if (err) {
      logger.error(err.stack);
      return cb(null);
    }
    cb(null, rows);
  });
};

module.exports = { findAll };
