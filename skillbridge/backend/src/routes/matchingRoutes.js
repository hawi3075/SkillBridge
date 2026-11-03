const express = require('../utils/expressShim');
const router = express.Router();
const matchingController = require('../controllers/matchingController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, matchingController.getMatches);
router.get('/:targetUserId', authenticate, matchingController.getMatchWithUser);

module.exports = router;
