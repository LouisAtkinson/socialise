const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  posts: [
    {
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
      comments: [
        {
          author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          content: String,
          date: Date,
        },
      ],
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
