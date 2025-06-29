const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const productRoutes = require('./routes/productRoutes');
const  connectDB  = require('./config/db.js');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

// app.use(authMiddleware);
// app.use(tokenMiddleware);

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/products', productRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
});

app.get('/', (req, res) => {
    res.status(200).json({ message: ' its running' });
});

module.exports = app;