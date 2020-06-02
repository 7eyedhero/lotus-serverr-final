module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://captain@localhost/ghost-triiibe',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://captain@localhost/ghost-triiibe-test',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h'
};
