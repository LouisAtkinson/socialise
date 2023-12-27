const Notification = require('../models/notification');
const Comment = require('../models/comment');

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: 'desc' })
      .populate('sender', 'firstName lastName displayPicture')
      .select('isRead type');
    res.json(notifications);
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const markAsRead = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { $set: { isRead: true } },
        { new: true }
      );
      res.json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
module.exports = { getNotifications, deleteNotification, markAsRead };