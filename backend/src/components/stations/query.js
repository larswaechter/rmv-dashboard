const db = require("../../config/db");
const logger = require("../../config/logger");

const findAllStations = () =>
  new Promise((resolve, reject) =>
    db.all("SELECT * FROM stations;", (err, rows) => {
      if (err) {
        logger.error(err.stack);
        return reject("Failed to create stations");
      }
      resolve(rows);
    })
  );

const createStation = ({ name, station_id }) =>
  new Promise((resolve, reject) =>
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

const deleteStation = (id) =>
  new Promise((resolve, reject) =>
    db.run("DELETE FROM stations WHERE id = ?", [id], (err) => {
      if (err) {
        logger.error(err.stack);
        return reject("Failed to delete station");
      }
      resolve();
    })
  );

module.exports = { findAllStations, createStation, deleteStation };
