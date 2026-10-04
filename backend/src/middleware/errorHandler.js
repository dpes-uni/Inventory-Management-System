/**
 * Central error handler middleware
 * Converts thrown errors into consistent JSON responses
 */
const errorHandler = (err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500
  res.status(status).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  })
}

module.exports = errorHandler