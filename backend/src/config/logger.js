const { join } = require("path");
const { existsSync, mkdirSync } = require("fs");
const { createLogger, format, transports } = require("winston");

const logDir = "logs";

// Create the log directory if it does not exist
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const errorLog = join(logDir, "error.log");
const exceptionsLog = join(logDir, "exceptions.log");

const logger = createLogger({
  silent: process.env.NODE_ENV === "test",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: errorLog,
      level: "error",
    }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
        )
      ),
      level: "debug",
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: exceptionsLog,
    }),
  ],
});

module.exports = logger;
