const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(__dirname + "/../../db.sqlite");

module.exports = db;
