const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const displayPictureController = require('../controllers/displayPictureController');

const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET, { expiresIn: '3d' });
}

const register = async (req, res) => {
  const {firstName, lastName, email, password} = req.body;

  try {
    const user = await User.register(firstName, lastName, email, password);
    const token = createToken(user._id);
    res.status(200).json({email, token, id: user._id});
  } catch (err) {
    res.status(400).json({error: err.message});
  }  
}

const logIn = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({id: user._id, email, token});
  } catch (err) {
    res.status(400).json({error: err.message});
  }
}

const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;
    const regex = new RegExp(`^${query}`, 'i');

    const users = await User.find(
      {
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
        ],
      },
      'id firstName lastName hometown visibility'
    );

    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      birthDay: user.birthDay,
      birthMonth: user.birthMonth,
      hometown: user.hometown,
      occupation: user.occupation,
      displayPicture: user.displayPicture,
      visibility: user.visibility,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { birthDay, birthMonth, hometown, occupation, privateInfo } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.file) {
      const filename = req.file.originalname;
      const buffer = req.file.buffer;

      const displayPictureId = await displayPictureController.uploadDisplayPicture(userId, filename, buffer);

      user.displayPicture = displayPictureId;
    }

    user.birthDay = birthDay;
    user.birthMonth = birthMonth;
    user.hometown = hometown;
    user.occupation = occupation;

    user.visibility.dateOfBirth = !privateInfo.dateOfBirth;
    user.visibility.hometown = !privateInfo.hometown;
    user.visibility.occupation = !privateInfo.occupation;

    await user.save();

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateDisplayPicture = async (userId, displayPictureId) => {
  try {
    await User.findByIdAndUpdate(userId, { displayPicture: displayPictureId });
  } catch (error) {
    throw new Error(`Error updating display picture: ${error.message}`);
  }
};

module.exports = { register, logIn, getUserProfile, updateUserProfile, updateDisplayPicture, searchUsers };