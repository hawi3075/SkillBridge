const express = require('../utils/expressShim');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');
const { authenticate } = require('../middleware/auth');
const { exchangeRequestValidator } = require('../validators/validators');

router.get('/', authenticate, exchangeController.getExchanges);
router.get('/:id', authenticate, exchangeController.getExchangeById);
router.post('/', authenticate, exchangeRequestValidator, exchangeController.sendExchangeRequest);
router.put('/:id/accept', authenticate, exchangeController.acceptExchange);
router.put('/:id/reject', authenticate, exchangeController.rejectExchange);
router.put('/:id/complete', authenticate, exchangeController.completeExchange);
router.put('/:id/cancel', authenticate, exchangeController.cancelExchange);

module.exports = router;
