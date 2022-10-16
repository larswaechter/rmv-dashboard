const { join } = require("path");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(join(__dirname, "../../../data/db.sqlite"));

module.exports = db;
