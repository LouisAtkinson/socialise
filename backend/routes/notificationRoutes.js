const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/user/:userId/notifications', notificationController.getNotifications);
router.delete('/notifications/:notificationId', notificationController.deleteNotification);
router.delete('/user/:userId/notifications', notificationController.deleteAllNotifications); // New route
router.put('/notifications/:notificationId/markAsRead', notificationController.markAsRead);
router.put('/user/:userId/notifications/markAllAsRead', notificationController.markAllAsRead); // New route

module.exports = router;