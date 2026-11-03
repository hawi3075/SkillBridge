const express = require('../utils/expressShim');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, requireRole } = require('../middleware/auth');
const { reviewValidator } = require('../validators/validators');

router.post('/', authenticate, reviewValidator, reviewController.createReview);
router.get('/user/:userId', reviewController.getUserReviews);
router.put('/:id/moderate', authenticate, requireRole('ADMIN'), reviewController.moderateReview);
router.delete('/:id', authenticate, requireRole('ADMIN'), reviewController.deleteReview);

module.exports = router;
