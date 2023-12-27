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
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error initializing GridFS:', error);
  }
});

exports.uploadDisplayPicture = async (req, res) => {
  try {
    debugger;
    const { userId } = req.params;
    const { buffer, originalname } = req.file;

    

    console.log(req.file)

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

      await User.findByIdAndUpdate(userId, { displayPicture: new mongoose.Types.ObjectId(displayPictureId) });
      res.status(201).json({ fileId: displayPictureId });
    });
  } catch (error) {
    console.log('Oh no', error)
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

    console.log(displayPictureId)

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
    const displayPicture = await DisplayPicture.findOne({ userId })
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
    const displayPictureId = req.params.displayPictureIdId;
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
      displayPictureId: displayPictureId
    });

    const savedComment = await newComment.save();

    displayPicture.comments.push(savedComment._id);
    await displayPicture.save();

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

exports.toggleLike = async (req, res) => {
  try {
    const { displayPictureId } = req.params;
    const { userId } = req.user;

    await toggleLike(displayPictureId, userId);

    res.status(201).json({ message: 'Like toggled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};