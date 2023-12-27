const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['friendRequest', 'friendRequestAccepted', 'comment', 'like'],
    },
    content: String, 
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
});

module.exports = mongoose.model('Notification', notificationSchema);