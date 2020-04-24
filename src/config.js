module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.DB_URL || 'postgresql://captain@localhost/ghost-triiibe',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret'
};
