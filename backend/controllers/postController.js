const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');

const getAllPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const friends = user.friends;

    const posts = await Post.find({ $or: [{ author: userId }, { author: { $in: friends } }] })
      .populate('author', 'id firstName lastName displayPicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'firstName lastName displayPicture',
        },
        select: 'date',
        populate: {
          path: 'likes',
          select: 'firstName lastName displayPicture',
        },
      })
      .populate({
        path: 'likes',
        select: 'firstName lastName displayPicture',
      })
      .sort({ date: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.body.user.id;

    const newPost = await Post.create({
      author: userId,
      content,
      date: new Date(),
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addComment = async (req, res) => {
  try {
    const userId = req.body.user.id;
    const postId = req.params.postId;
    const { content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = await Comment.create({
      _id: new mongoose.Types.ObjectId(),
      author: userId,
      content,
      date: new Date(),
      postId: postId
    });

    const savedComment = await newComment.save();

    post.comments.push(savedComment._id);
    await post.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
  

const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: 'Post already liked' });
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      return res.status(400).json({ error: 'Post not liked' });
    }

    post.likes.splice(likeIndex, 1);
    await post.save();

    res.status(200).json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const likeComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.body.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.likes.includes(userId)) {
      return res.status(400).json({ error: 'Comment already liked' });
    }

    comment.likes.push(userId);
    await post.save();

    res.status(200).json({ message: 'Comment liked successfully' });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const unlikeComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.body.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex === -1) {
      return res.status(400).json({ error: 'Comment not liked' });
    }

    comment.likes.splice(likeIndex, 1);
    await post.save();

    res.status(200).json({ message: 'Like removed from comment successfully' });
  } catch (error) {
    console.error('Error removing like from comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
    getAllPosts,
    addPost,
    deletePost,
    addComment,
    deleteComment,
    likePost,
    unlikePost,
    likeComment,
    unlikeComment
};