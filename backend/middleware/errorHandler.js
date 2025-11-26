const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error({ err, url: req.url }, "Unhandled error");
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res
    .status(status)
    .json({ message: status === 500 ? "Internal Server Error" : err.message });
}

module.exports = errorHandler;
