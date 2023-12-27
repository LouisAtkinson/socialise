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
router.post('/:displayPictureId/comments', requireAuth, displayPictureController.addComment);
router.delete('/:displayPictureId/comments/:commentId', requireAuth, displayPictureController.removeComment);
router.post('/:displayPictureId/likes', requireAuth, displayPictureController.toggleLike);

module.exports = router;