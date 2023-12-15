const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { requireAuth } = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/:userId', postController.getAllPosts);
router.post('/', postController.addPost);
router.delete('/:postId', postController.deletePost);
router.post('/:postId/comments', postController.addComment);
router.delete('/:postId/comments/:commentId', postController.deleteComment);
router.post('/:postId/like', postController.likePost);
router.delete('/:postId/unlike', postController.unlikePost);

module.exports = router;