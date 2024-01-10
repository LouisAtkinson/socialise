const User = require('../models/user');
const Notification = require('../models/notification');
const mongoose = require('mongoose');

const getAllFriends = async (req, res) => {
  try {
    const { loggedInUserId } = req.params;
    const loggedInObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    const loggedInUser = await User.findById(loggedInObjectId).select('friends');

    if (!loggedInUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friends = await User.find({ _id: { $in: loggedInUser.friends } })
      .select('firstName lastName displayPicture') 
      .populate('displayPicture', 'filename'); 
    
    res.json(friends);
  } catch (error) {
    console.error('Error getting all friends:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const checkFriendshipStatus = async (req, res) => {
  try {
    const { loggedInUserId, otherUserId } = req.params;

    const loggedInObjectId = new mongoose.Types.ObjectId(loggedInUserId);
    const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);
    
    const loggedInUser = await User.findById(loggedInObjectId).select('friends notifications');
    const otherUser = await User.findById(otherUserObjectId);

    if (!loggedInUser || !otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const areFriends = loggedInUser.friends.includes(otherUserObjectId);

    const hasPendingRequestFromLoggedInUser = await hasPendingRequest(
      otherUser.notifications,
      loggedInObjectId,
      'friendRequest'
    );

    const hasPendingRequestFromOtherUser = await hasPendingRequest(
      loggedInUser.notifications,
      otherUserObjectId,
      'friendRequest'
    );

    res.json({
      areFriends,
      hasPendingRequestFromLoggedInUser,
      hasPendingRequestFromOtherUser,
    });
  } catch (error) {
    console.error('Error checking friendship status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const hasPendingRequest = async (notifications, userId, type) => {
  if (!notifications || notifications.length === 0) {
    return false;
  }

  for (const notificationId of notifications) {
    const notification = await Notification.findById(notificationId);

    if (
      notification &&
      notification.sender.equals(userId) &&
      notification.type === type
    ) {
      return true; 
    }
  }

  return false; 
};

const sendFriendRequest = async (req, res) => {
  try {
    const { loggedInUserId, otherUserId } = req.params;

    const loggedInObjectId = new mongoose.Types.ObjectId(loggedInUserId);
    const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);

    const loggedInUser = await User.findById(loggedInObjectId).select('friends');
    const otherUser = await User.findById(otherUserObjectId);

    if (!loggedInUser || !otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const areFriends = loggedInUser.friends.includes(otherUserId);

    const existingRequest = await Notification.findOne({
      sender: loggedInObjectId,
      recipient: otherUserObjectId,
      type: 'friendRequest',
      isRead: false,
    });

    if (!areFriends && !existingRequest) {
      const newNotification = await Notification.create({
        sender: loggedInObjectId,
        recipient: otherUserObjectId,
        type: 'friendRequest',
        timestamp: new Date(),
      });

      const savedNotification = await newNotification.save();

      otherUser.notifications.push(savedNotification._id);
      await otherUser.save();

      res.status(201).json({ message: 'Friend request sent successfully', notification: savedNotification });
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { loggedInUserId, otherUserId } = req.params;

    const loggedInObjectId = new mongoose.Types.ObjectId(loggedInUserId);
    const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);

    const loggedInUser = await User.findById(loggedInObjectId).select('friends notifications');
    const otherUser = await User.findById(otherUserObjectId);

    const friendRequestNotification = loggedInUser.notifications.find(
      async (notificationId) => {
        const notification = await Notification.findById(notificationId);
        return (
          notification &&
          notification.sender.equals(otherUserObjectId) &&
          notification.type === 'friendRequest' &&
          !notification.isRead
        );
      }
    );

    if (friendRequestNotification) {
      loggedInUser.notifications = loggedInUser.notifications.filter(
        (notificationId) => !notificationId.equals(friendRequestNotification._id)
      );

      await Notification.findByIdAndDelete(friendRequestNotification._id);

      loggedInUser.friends.push(otherUserObjectId);
      otherUser.friends.push(loggedInObjectId);

      await loggedInUser.save();
      await otherUser.save();

      const friendRequestAcceptedNotification = new Notification({
        sender: otherUserObjectId,
        recipient: loggedInObjectId,
        type: 'friendRequestAccepted',
      });

      await friendRequestAcceptedNotification.save();

      res.status(200).json({ message: 'Friend request accepted successfully' });
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const denyFriendRequest = async (req, res) => {
  try {
    const { loggedInUserId, otherUserId } = req.params;

    const loggedInObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    const loggedInUser = await User.findById(loggedInObjectId).select('notifications');
    
    const friendRequestNotification = loggedInUser.notifications.find(
      async (notificationId) => {
        const notification = await Notification.findById(notificationId);
        return (
          notification &&
          notification.sender.equals(otherUserObjectId) &&
          notification.type === 'friendRequest' &&
          !notification.isRead
        );
      }
    );

    if (friendRequestNotification) {
      loggedInUser.notifications = loggedInUser.notifications.filter(
        (notificationId) => !notificationId.equals(friendRequestNotification._id)
      );

      await Notification.findByIdAndDelete(friendRequestNotification._id);

      await loggedInUser.save();

      res.status(200).json({ message: 'Friend request denied successfully' });
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  } catch (error) {
    console.error('Error denying friend request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { loggedInUserId, otherUserId } = req.params;

    const loggedInObjectId = new mongoose.Types.ObjectId(loggedInUserId);
    const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);

    const loggedInUser = await User.findById(loggedInObjectId).select('friends');
    const otherUser = await User.findById(otherUserObjectId);

    loggedInUser.friends = loggedInUser.friends.filter((friend) => !friend.equals(otherUserObjectId));
    otherUser.friends = otherUser.friends.filter((friend) => !friend.equals(loggedInObjectId));

    await loggedInUser.save();
    await otherUser.save();

    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllFriends,
  checkFriendshipStatus,
  sendFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  removeFriend,
};
