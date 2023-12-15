const mongoose = require('mongoose');
const validator = require('validator'); 
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  visibility: {
    dateOfBirth: {
      type: Boolean,
      default: false,
    },
    hometown: {
      type: Boolean,
      default: false,
    },
    occupation: {
      type: Boolean,
      default: false,
    },
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  hometown: {
    type: String,
    required: false,
  },
  occupation: {
    type: String,
    required: false,
  },
  displayPicture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DisplayPicture',
  },
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
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
    },
  ],
});

userSchema.statics.register = async function(firstName, lastName, email, password) {
  if (!firstName || ! lastName || !email || !password) {
    throw Error('All fields must be filled');
  }

  if (!validator.isEmail(email)) {
    throw Error('Email must be a valid email address');
  }

  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough');
  }
 
  const exists = await this.findOne({ email});

  if (exists) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ firstName, lastName, email, password: hash});

  return user;
}

userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  const user = await this.findOne({email});

  if (!user) {
    throw Error('No account exists with this email address')
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Incorrect password');
  }

  return user;
}

module.exports = mongoose.model('User', userSchema);
