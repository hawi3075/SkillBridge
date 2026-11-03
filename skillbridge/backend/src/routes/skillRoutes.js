const express = require('../utils/expressShim');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { authenticate, requireRole } = require('../middleware/auth');

// Categories
router.get('/categories', skillController.getCategories);
router.post('/categories', authenticate, requireRole('ADMIN'), skillController.createCategory);
router.put('/categories/:id', authenticate, requireRole('ADMIN'), skillController.updateCategory);
router.delete('/categories/:id', authenticate, requireRole('ADMIN'), skillController.deleteCategory);

// Skills
router.get('/', skillController.getAllSkills);
router.get('/detail/:slug', skillController.getSkillBySlug);
router.post('/', authenticate, requireRole('ADMIN'), skillController.createSkill);
router.put('/:id', authenticate, requireRole('ADMIN'), skillController.updateSkill);
router.delete('/:id', authenticate, requireRole('ADMIN'), skillController.deleteSkill);

// User skills (offered and wanted)
router.get('/user/my-skills', authenticate, skillController.getUserSkills);
router.post('/user/offered', authenticate, skillController.addOfferedSkill);
router.delete('/user/offered/:skillId', authenticate, skillController.removeOfferedSkill);
router.post('/user/wanted', authenticate, skillController.addWantedSkill);
router.delete('/user/wanted/:skillId', authenticate, skillController.removeWantedSkill);

module.exports = router;
