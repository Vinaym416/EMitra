const express = require('express');
const NotificationController = require('../controllers/notificationController');

const router = express.Router();
const notificationController = new NotificationController();

// Route to send a notification
router.post('/send', notificationController.sendNotification);

// Route to get notifications for a user
router.get('/:userId', notificationController.getUserNotifications);

// Route to delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;