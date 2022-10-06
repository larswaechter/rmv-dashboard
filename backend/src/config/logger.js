const { join } = require("path");
const { existsSync, mkdirSync } = require("fs");
const { createLogger, format, transports } = require("winston");

const logDir = "logs";
const isDevEnv = process.env.NODE_ENV === "develop";

// Create the log directory if it does not exist
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}
const debugLog = join(logDir, "debug.log");
const errorLog = join(logDir, "error.log");
const exceptionsLog = join(logDir, "exceptions.log");
const rejectionsLog = join(logDir, "rejections.log");

const logger = createLogger({
  format: format.simple(),
  silent: process.env.NODE_ENV === "test",
});

if (isDevEnv) {
  logger.add(
    new transports.Console({
      level: "debug",
      format: format.combine(format.colorize(), format.simple()),
    })
  );

  logger.add(
    new transports.File({
      filename: debugLog,
      level: "debug",
      format: format.combine(
        format.timestamp(),
        format.printf(
          ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
        )
      ),
    })
  );

  /*
  logger.exceptions.handle(
    new transports.Console({
      format: format.simple(),
    })
  );
  */
} else {
  logger.add(
    new transports.File({
      filename: errorLog,
      level: "error",
      format: format.json(),
    })
  );

  logger.exceptions.handle(
    new transports.File({
      filename: exceptionsLog,
      format: format.json(),
    })
  );

  logger.rejections.handle(
    new transports.File({
      filename: rejectionsLog,
      format: format.json(),
    })
  );
}

module.exports = logger;
