const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// User registration route
router.post('/register', authController.register);

// User login route
router.post('/login', authController.login);

// Get user profile route (protected)
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

module.exports = router;