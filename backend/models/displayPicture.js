const mongoose = require('mongoose');

const displayPictureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  filename: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('DisplayPicture', displayPictureSchema);