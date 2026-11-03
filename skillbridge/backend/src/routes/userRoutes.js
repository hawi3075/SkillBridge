const express = require('../utils/expressShim');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', optionalAuth, userController.getAllUsers);
router.get('/:id', optionalAuth, userController.getUserById);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/avatar', authenticate, upload, userController.uploadAvatar);
router.delete('/account', authenticate, userController.deleteAccount);

module.exports = router;
