const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const DisplayPicture = require('../models/displayPicture');

const connection = mongoose.connection;
grid.mongo = mongoose.mongo;

let gfs;
connection.once('open', () => {
  gfs = grid(connection.db);
});

exports.uploadDisplayPicture = async (userId, filename, fileBuffer) => {
  try {
    const writeStream = gfs.createWriteStream({ filename, metadata: { userId } });
    writeStream.write(fileBuffer);
    writeStream.end();

    return writeStream.id;
  } catch (error) {
    throw new Error(`Error uploading display picture: ${error.message}`);
  }
};

exports.getDisplayPictureIdByUserId = async (userId) => {
  try {
    const file = await DisplayPicture.findOne({ userId });
    return file ? file.id : null;
  } catch (error) {
    throw new Error(`Error getting display picture ID by user ID: ${error.message}`);
  }
};

exports.getDisplayPictureById = (displayPictureId) => {
  try {
    return gfs.createReadStream({ _id: displayPictureId });
  } catch (error) {
    throw new Error(`Error getting display picture: ${error.message}`);
  }
};

exports.addComment = async (displayPictureId, userId, content) => {
  try {
    const newComment = {
      userId,
      content,
      datetime: new Date(),
    };

    await DisplayPicture.findByIdAndUpdate(displayPictureId, {
      $push: { comments: newComment },
    });

    return newComment;
  } catch (error) {
    throw new Error(`Error adding comment: ${error.message}`);
  }
};

exports.removeComment = async (displayPictureId, commentId, userId) => {
  try {
    const displayPicture = await DisplayPicture.findById(displayPictureId);
    const commentIndex = displayPicture.comments.findIndex(
      (comment) => comment._id.equals(commentId) && comment.userId.equals(userId)
    );

    if (commentIndex === -1) {
      throw new Error('User is not authorized to remove this comment');
    }

    displayPicture.comments.splice(commentIndex, 1);
    await displayPicture.save();

    return true;
  } catch (error) {
    throw new Error(`Error removing comment: ${error.message}`);
  }
};

exports.toggleLike = async (displayPictureId, userId) => {
  try {
    const displayPicture = await DisplayPicture.findById(displayPictureId);
    const isLiked = displayPicture.likes.includes(userId);

    if (isLiked) {
      await DisplayPicture.findByIdAndUpdate(displayPictureId, {
        $pull: { likes: userId },
      });
    } else {
      await DisplayPicture.findByIdAndUpdate(displayPictureId, {
        $push: { likes: userId },
      });
    }

    return true;
  } catch (error) {
    throw new Error(`Error toggling like: ${error.message}`);
  }
};
