require('dotenv').config()

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/inventory_management',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  // Production frontend URL takes precedence; CORS_ORIGIN is kept as a fallback for local dev.
  corsOrigin: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:5173',
}

// Fail fast if critical config is missing in production
if (env.nodeEnv === 'production' && env.jwtSecret === 'dev-secret-change-in-production') {
  console.warn('WARNING: JWT_SECRET is using the default dev value in production.')
}

module.exports = env