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
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      content: String,
      datetime: {
        type: Date,
        default: Date.now,
      },
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
