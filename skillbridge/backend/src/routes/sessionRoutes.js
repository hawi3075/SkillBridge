const express = require('../utils/expressShim');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticate } = require('../middleware/auth');
const { sessionValidator } = require('../validators/validators');

router.get('/', authenticate, sessionController.getSessions);
router.get('/:id', authenticate, sessionController.getSessionById);
router.post('/', authenticate, sessionValidator, sessionController.createSession);
router.put('/:id', authenticate, sessionController.updateSession);
router.delete('/:id', authenticate, sessionController.deleteSession);

module.exports = router;
