const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/user/:userId/notifications', notificationController.getNotifications);
router.delete('/notifications/:notificationId', notificationController.deleteNotification);
router.put('/notifications/:notificationId/markAsRead', notificationController.markAsRead);

module.exports = router;