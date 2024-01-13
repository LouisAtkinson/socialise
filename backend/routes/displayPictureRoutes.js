const express = require('express');
const router = express.Router();
const displayPictureController = require('../controllers/displayPictureController');
const { requireAuth } = require('../middleware/requireAuth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

router.post('/:userId', requireAuth, upload.single('file'), displayPictureController.uploadDisplayPicture);
router.get('/user/:userId', displayPictureController.getDisplayPictureByUserId);
router.get('/user/:userId/details', displayPictureController.getDisplayPictureDetails);
// router.get('/:displayPictureId', displayPictureController.getDisplayPictureById);
router.post('/:userId/comments', displayPictureController.addComment);
router.delete('/:displayPictureId/comments/:commentId', displayPictureController.removeComment);
router.post('/:userId/like', displayPictureController.likeDisplayPicture);
router.delete('/:userId/unlike', displayPictureController.unlikeDisplayPicture);
router.post('/:displayPictureId/comments/:commentId/like', displayPictureController.likeComment);
router.delete('/:displayPictureId/comments/:commentId/unlike',displayPictureController.unlikeComment);

module.exports = router;