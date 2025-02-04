const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Create Sequelize instance with retry configuration
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    port: process.env.DB_PORT || 3306, // Database port
    dialect: 'mysql', // Use MySQL dialect
    logging: false, // Disable logging for cleaner output
    retry: {
      max: 5, // Number of retry attempts
      match: [
        /ECONNRESET/,
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /ENOENT/,
        /ESOCKETTIMEDOUT/,
        /ECONNREFUSED/
      ],
      backoffBase: 1000, // Initial backoff duration in ms
      backoffExponent: 1.5 // Exponential backoff factor
    }
  }
);

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

module.exports = sequelize;
