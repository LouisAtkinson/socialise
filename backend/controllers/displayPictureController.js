const mongoose = require('mongoose');
const Comment = require('../models/comment');
const DisplayPicture = require('../models/displayPicture');
const Notification = require('../models/notification');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const User = require('../models/user');
const sharp = require('sharp');

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

const uploadDisplayPicture = async (req, res) => {
  try {
    const { userId } = req.params;
    const { buffer, originalname } = req.file;

    const compressedBuffer = await sharp(buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 70 }) 
      .toBuffer();

    const uploadStream = gfs.openUploadStream(originalname, {
      metadata: {
        userId,
        filename: originalname,
      },
    });

    uploadStream.write(compressedBuffer);
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

const getDisplayPictureByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const displayPictureId = await getDisplayPictureIdByUserId(userId);

    if (!displayPictureId) {
      return res.status(200).json({ message: 'User does not have a display picture' });
    }

    const downloadStream = gfs.openDownloadStream(displayPictureId);

    res.setHeader('Content-Type', 'image/jpeg');

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

const getDisplayPictureDetails = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const displayPicture = await DisplayPicture.findOne({ userId: user._id })
      .populate({
        path: 'likes',
        select: 'id firstName lastName displayPicture',
      })
      .populate({
        path: 'comments',
        select: 'date likes content author',
        populate: [
          {
            path: 'author',
            select: 'id firstName lastName displayPicture',
          },
          {
            path: 'likes',
            select: 'id firstName lastName displayPicture',
          },
        ]
      })

    if (!displayPicture) {
      return res.status(200).json({ message: 'User does not have a display picture' });
    }

    res.status(200).json({
      displayPictureId: displayPicture._id,
      uploadDate: displayPicture.uploadDate,
      comments: displayPicture.comments,
      likes: displayPicture.likes,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.error('Error fetching user display picture details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addComment = async (req, res) => {
  try {
    const userId = req.body.user.id;
    const { content } = req.body;
    const displayPictureOwnerId = req.params.userId;

    const displayPicture = await DisplayPicture.findOne({ userId: displayPictureOwnerId });

    if (!displayPicture) {
      return res.status(404).json({ error: 'Display picture not found' });
    }

    const newComment = await Comment.create({
      _id: new mongoose.Types.ObjectId(),
      author: userId,
      content,
      date: new Date(),
      displayPictureId: displayPicture._id,
    });

    const savedComment = await newComment.save();

    displayPicture.comments.push(savedComment._id);
    await displayPicture.save();

    if (displayPictureOwnerId !== userId) {
      const newNotification = await Notification.create({
        sender: userId,
        recipient: displayPicture.userId,
        type: 'displayPictureComment',
        displayPictureId: displayPicture._id,
        timestamp: new Date(),
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

const removeComment = async (req, res) => {
  try {
    const displayPictureId = req.params.displayPictureId;
    const commentId = req.params.commentId;

    const displayPicture = await DisplayPicture.findById(displayPictureId);

    if (!displayPicture) {
      return res.status(404).json({ error: 'Display picture not found' });
    }

    const commentIndex = displayPicture.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }

    displayPicture.comments.splice(commentIndex, 1);
    await displayPicture.save();

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const likeDisplayPicture = async (req, res) => {
  try {
    const userId = req.body.user.id;
    const displayPictureOwnerId = req.params.userId;

    const displayPicture = await DisplayPicture.findOne({ userId: displayPictureOwnerId });

    if (!displayPicture) {
      return res.status(404).json({ error: 'Display picture not found' });
    }

    if (displayPicture.likes.includes(userId)) {
      return res.status(400).json({ error: 'Display picture already liked' });
    }

    displayPicture.likes.push(userId);
    await displayPicture.save();

    if (displayPictureOwnerId !== userId) {
      const newNotification = await Notification.create({
        sender: userId,
        recipient: displayPicture.userId,
        type: 'displayPictureLike',
        displayPictureId: displayPicture._id,
        timestamp: new Date(),
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

const unlikeDisplayPicture = async (req, res) => {
  try {
    const userId = req.body.user.id;
    const displayPictureOwnerId = req.params.userId;

    const displayPicture = await DisplayPicture.findOne({ userId: displayPictureOwnerId });

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

const likeComment = async (req, res) => {
  try {
    const displayPictureId = req.params.displayPictureId;
    const commentId = req.params.commentId;
    const userId = req.body.user.id;

    const displayPicture = await DisplayPicture.findById(displayPictureId).populate('comments');

    if (!displayPicture) {
      return res.status(404).json({ error: 'Display picture not found' });
    }

    const comment = displayPicture.comments.find(commentObjectId => commentObjectId.equals(commentId));

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.likes.includes(userId)) {
      return res.status(400).json({ error: 'Comment already liked' });
    }

    comment.likes.push(userId);
    await comment.save();

    const commentAuthorId = comment.author;

    if (commentAuthorId.toString() !== userId) {
      const newNotification = await Notification.create({
        sender: userId,
        recipient: commentAuthorId,
        type: 'displayPictureCommentLike',
        displayPictureId: displayPictureId,
        timestamp: new Date(),
      });

      const savedNotification = await newNotification.save();

      const commentAuthor = await User.findById(commentAuthorId);
      commentAuthor.notifications.push(savedNotification._id);
      await commentAuthor.save();
    }

    res.status(200).json({ message: 'Comment liked successfully' });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const unlikeComment = async (req, res) => {
  try {
    const displayPictureId = req.params.displayPictureId;
    const commentId = req.params.commentId;
    const userId = req.body.user.id;

    const displayPicture = await DisplayPicture.findById(displayPictureId).populate('comments');

    if (!displayPicture) {
      return res.status(404).json({ error: 'Display picture not found' });
    }

    const comment = displayPicture.comments.find(commentObjectId => commentObjectId.equals(commentId));

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex === -1) {
      return res.status(400).json({ error: 'Comment not liked' });
    }

    comment.likes.splice(likeIndex, 1);
    await comment.save();

    res.status(200).json({ message: 'Like removed from comment successfully' });
  } catch (error) {
    console.error('Error removing like from comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  uploadDisplayPicture,
  getDisplayPictureByUserId,
  getDisplayPictureDetails,
  addComment,
  removeComment,
  likeDisplayPicture,
  unlikeDisplayPicture,
  likeComment,
  unlikeComment,
};