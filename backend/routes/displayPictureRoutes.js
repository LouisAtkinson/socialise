const express = require('express');
const router = express.Router();
const displayPictureController = require('../controllers/displayPictureController');
const { requireAuth } = require('../middleware/requireAuth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { userId } = req.user;
    const { buffer, originalname } = req.file;

    const fileId = await displayPictureController.uploadDisplayPicture(userId, originalname, buffer);

    res.status(201).json({ fileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const displayPictureId = await displayPictureController.getDisplayPictureIdByUserId(userId);

    if (!displayPictureId) {
      return res.status(404).json({ error: 'Display picture not found for the user' });
    }

    const stream = await displayPictureController.getDisplayPictureById(displayPictureId);

    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:displayPictureId', async (req, res) => {
  try {
    const { displayPictureId } = req.params;
    const stream = await displayPictureController.getDisplayPictureById(displayPictureId);

    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:displayPictureId/comments', requireAuth, async (req, res) => {
    try {
      const { displayPictureId } = req.params;
      const { userId } = req.user;
      const { content } = req.body;
  
      await displayPictureController.addComment(displayPictureId, userId, content);
  
      res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.delete('/:displayPictureId/comments/:commentId', requireAuth, async (req, res) => {
    try {
      const { displayPictureId, commentId } = req.params;
      const { userId } = req.user;
  
      await displayPictureController.removeComment(displayPictureId, commentId, userId);
  
      res.json({ message: 'Comment removed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/:displayPictureId/likes', requireAuth, async (req, res) => {
    try {
      const { displayPictureId } = req.params;
      const { userId } = req.user;
  
      await displayPictureController.toggleLike(displayPictureId, userId);
  
      res.status(201).json({ message: 'Like toggled successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;
