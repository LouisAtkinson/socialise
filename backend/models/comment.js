const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: String,
  date: Date,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  displayPictureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DisplayPicture',
  },
});

module.exports = mongoose.model('Comment', commentSchema);