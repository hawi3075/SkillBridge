const express = require('../utils/expressShim');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

router.get('/conversations', authenticate, messageController.getConversations);
router.post('/conversations/direct', authenticate, messageController.getOrCreateDirectConversation);
router.get('/conversations/:conversationId/messages', authenticate, messageController.getMessages);
router.post('/conversations/:conversationId/messages', authenticate, messageController.sendMessage);

module.exports = router;
