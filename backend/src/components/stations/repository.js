const db = require("../../config/db");
const logger = require("../../config/logger");

const StationsRepository = {
  findAll: () => {
    logger.debug("DB Call StationsRepository.findAll()");

    return new Promise((resolve, reject) =>
      db.all("SELECT * FROM stations;", (err, rows) => {
        if (err) {
          logger.error(err.stack);
          return reject("Failed to fetch stations");
        }
        resolve(rows);
      })
    );
  },

  find: (id) => {
    logger.debug("DB Call StationsRepository.find()");

    return new Promise((resolve, reject) =>
      db.all("SELECT * FROM stations WHERE id = ?;", [id], (err, rows) => {
        if (err) {
          logger.error(err.stack);
          return reject("Failed to fetch station");
        }
        resolve(rows?.[0]);
      })
    );
  },

  create: ({ name, station_id }) => {
    logger.debug("DB Call StationsRepository.create()");

    return new Promise((resolve, reject) =>
      db.run(
        "INSERT INTO stations (name, station_id) VALUES(?,?);",
        [name, station_id],
        (err) => {
          if (err) {
            logger.error(err.stack);
            return reject("Failed to create station");
          }
          resolve();
        }
      )
    );
  },

  delete: (id) => {
    logger.debug("DB Call StationsRepository.delete()");

    return new Promise((resolve, reject) =>
      db.run("DELETE FROM stations WHERE id = ?", [id], (err) => {
        if (err) {
          logger.error(err.stack);
          return reject("Failed to delete station");
        }
        resolve();
      })
    );
  },
};

module.exports = StationsRepository;
