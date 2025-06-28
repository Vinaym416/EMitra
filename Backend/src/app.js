const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { connectDB } = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const tokenMiddleware = require('./middleware/tokenMiddleware');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(authMiddleware);
app.use(tokenMiddleware);

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notification', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});