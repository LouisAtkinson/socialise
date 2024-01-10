const Notification = require('../models/notification');
const User = require('../models/user');
const Comment = require('../models/comment');

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ timestamp: -1 })
      .populate('sender', 'id firstName lastName displayPicture')
      .select('isRead type postId commentId displayPictureId');
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

const deleteAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await Promise.all(user.notifications.map(async (notificationId) => {
      await Notification.findByIdAndDelete(notificationId);
    }));

    user.notifications = [];
    await user.save();

    res.json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
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

const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    for (const notificationId of user.notifications) {
      console.log(notificationId)
      await Notification.findByIdAndUpdate(
        notificationId,
        { $set: { isRead: true } },
        { new: true }
      );
    }

    res.json({ message: 'All notifications marked as read successfully' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  
module.exports = { 
  getNotifications, 
  deleteNotification,
  deleteAllNotifications, 
  markAsRead,
  markAllAsRead
};