const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// User registration route
router.post('/register', authController.register);

// User login route
router.post('/login', authController.login);

// Get user profile route (protected)
router.get('/profile', authMiddleware, authController.getProfile);

// Google login route
router.post('/google-login', authController.googleLogin);

module.exports = router;