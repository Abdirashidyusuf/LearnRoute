const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to LearnRoute API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware (will be enhanced later)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;

