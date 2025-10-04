// server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // load .env
const express = require('express');
const app = express();

const sequelize = require('./db'); // db.js in the same folder
const authRoutes = require('./routes/auth');   // corrected path
const userRoutes = require('./routes/users');  // corrected path

app.use(express.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Test DB connection and sync tables, then start server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync();
    console.log('✅ Tables created');

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error('❌ Database connection or sync error:', err);
  }
})();
