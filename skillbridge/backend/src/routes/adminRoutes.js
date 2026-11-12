const express = require('../utils/expressShim');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);


router.post('/reports', adminController.createReport);


router.use(requireRole('ADMIN'));

router.get('/dashboard', adminController.getAdminDashboardStats);
router.get('/users', adminController.getAdminUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.get('/reports', adminController.getReports);
router.put('/reports/:id/status', adminController.updateReportStatus);

module.exports = router;
