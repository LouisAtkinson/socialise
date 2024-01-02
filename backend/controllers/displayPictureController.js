const mongoose = require('mongoose');
const Comment = require('../models/comment');
const DisplayPicture = require('../models/displayPicture');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const User = require('../models/user');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const connection = mongoose.connection;

let gfs;

connection.once('open', () => {
  try {
    gfs = new mongoose.mongo.GridFSBucket(connection.db, { bucketName: 'uploads' });
  } catch (error) {
    console.error('Error initializing GridFS:', error);
  }
});

exports.uploadDisplayPicture = async (req, res) => {
  try {
    debugger;
    const { userId } = req.params;
    const { buffer, originalname } = req.file;

    const uploadStream = gfs.openUploadStream(originalname, {
      metadata: {
        userId,
        filename: originalname,
      },
    });

    uploadStream.write(buffer);
    uploadStream.end();

    uploadStream.on('finish', async () => {
      const displayPictureId = uploadStream.id;

      await DisplayPicture.create({
        userId: new mongoose.Types.ObjectId(userId),
        filename: originalname,
      });

      await User.findByIdAndUpdate(userId, { displayPicture: new mongoose.Types.ObjectId(displayPictureId) });
      res.status(201).json({ fileId: displayPictureId });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDisplayPictureByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const displayPictureId = await getDisplayPictureIdByUserId(userId);

    if (!displayPictureId) {
      return res.status(404).json({ error: 'Display picture not found for the user' });
    }

    const downloadStream = gfs.openDownloadStream(displayPictureId);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('end', () => {
      res.end();
    });

    downloadStream.on('error', (error) => {
      console.error('Error in download stream:', error);
      res.status(500).json({ error: error.message });
    });
  } catch (error) {
    console.error('Error in getDisplayPictureByUserId:', error);
    res.status(500).json({ error: error.message });
  }
};

async function getDisplayPictureIdByUserId(userId) {
  try {
    const user = await User.findById(userId);
    return user ? user.displayPicture : null;
  } catch (error) {
    throw new Error(`Error retrieving display picture ID for user: ${error.message}`);
  }
}

exports.getDisplayPictureDetails = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const displayPicture = await DisplayPicture.findOne({ userId: user._id })
      .populate('comments')
      .populate('likes');

    if (!displayPicture) {
      return res.status(404).json({ message: 'User does not have a display picture' });
    }

    res.status(200).json({
      displayPictureId: displayPicture._id,
      uploadDate: displayPicture.uploadDate,
      comments: displayPicture.comments,
      likes: displayPicture.likes,
    });
  } catch (error) {
    console.error('Error fetching user display picture details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const userId = req.body.user.id;
    const displayPictureId = req.params.displayPictureId;
    const { content } = req.body;

    const displayPicture = await DisplayPicture.findById(displayPictureId);

    if (!displayPicture) {
      return res.status(404).json({ error: 'Display picture not found' });
    }

    const newComment = await Comment.create({
      _id: new mongoose.Types.ObjectId(),
      author: userId,
      content,
      date: new Date(),
      displayPictureId: displayPictureId,
    });

    const savedComment = await newComment.save();

    displayPicture.comments.push(savedComment._id);
    await displayPicture.save();

    if (displayPicture.userId !== userId) {
      const newNotification = await Notification.create({
        sender: userId,
        recipient: displayPicture.userId,
        type: 'displayPictureComment',
        displayPictureId: displayPictureId,
      });

      const savedNotification = await newNotification.save();

      const displayPictureOwner = await User.findById(displayPicture.userId);
      displayPictureOwner.notifications.push(savedNotification._id);
      await displayPictureOwner.save();
    }

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeComment = async (req, res) => {
  try {
    const { displayPictureId, commentId } = req.params;
    const { userId } = req.user;

    await removeComment(displayPictureId, commentId, userId);

    res.json({ message: 'Comment removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likeDisplayPicture = async (req, res) => {
  try {
    const displayPictureId = req.params.displayPictureId;
    const userId = req.body.user.id;

    const displayPicture = await DisplayPicture.findById(displayPictureId);

    if (!displayPicture) {
      return res.status(404).json({ error: 'Display picture not found' });
    }

    if (displayPicture.likes.includes(userId)) {
      return res.status(400).json({ error: 'Display picture already liked' });
    }

    displayPicture.likes.push(userId);
    await displayPicture.save();

    if (displayPicture.userId !== userId) {
      const newNotification = await Notification.create({
        sender: userId,
        recipient: displayPicture.userId,
        type: 'displayPictureLike',
        displayPictureId: displayPictureId,
      });

      const savedNotification = await newNotification.save();

      const displayPictureOwner = await User.findById(displayPicture.userId);
      displayPictureOwner.notifications.push(savedNotification._id);
      await displayPictureOwner.save();
    }

    res.status(200).json({ message: 'Display picture liked successfully' });
  } catch (error) {
    console.error('Error liking display picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.unlikeDisplayPicture = async (req, res) => {
  try {
    const displayPictureId = req.params.displayPictureId;
    const userId = req.body.user.id;

    const displayPicture = await DisplayPicture.findById(displayPictureId);

    if (!displayPicture) {
      return res.status(404).json({ error: 'Display picture not found' });
    }

    const likeIndex = displayPicture.likes.indexOf(userId);

    if (likeIndex === -1) {
      return res.status(400).json({ error: 'Display picture not liked' });
    }

    displayPicture.likes.splice(likeIndex, 1);
    await displayPicture.save();

    res.status(200).json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};