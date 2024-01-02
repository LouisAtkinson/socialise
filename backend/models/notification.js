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
      enum: [
        'friendRequest', 
        'friendRequestAccepted', 
        'postComment', 
        'postLike', 
        'commentLike', 
        'displayPictureComment', 
        'displayPictureLike'
      ],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    displayPictureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DisplayPicture',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
});

module.exports = mongoose.model('Notification', notificationSchema);