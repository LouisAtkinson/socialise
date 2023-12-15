const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');

router.get('/status/:loggedInUserId/:otherUserId', friendController.checkFriendshipStatus);
router.post('/add/:loggedInUserId/:otherUserId', friendController.sendFriendRequest);
router.post('/accept/:loggedInUserId/:otherUserId', friendController.acceptFriendRequest);
router.post('/deny/:loggedInUserId/:otherUserId', friendController.denyFriendRequest);
router.delete('/remove/:loggedInUserId/:otherUserId', friendController.removeFriend);

module.exports = router;