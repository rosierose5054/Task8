// db.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Ensure dotenv finds the file
const { Sequelize } = require('sequelize');

// Debug: check environment variables
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

// Create Sequelize instance
const sequelize = new Sequelize(
  String(process.env.DB_NAME),
  String(process.env.DB_USER),
  String(process.env.DB_PASSWORD),
  {
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false, // set to true if you want SQL logs
  }
);

// Test the connection immediately
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
})();

module.exports = sequelize;
