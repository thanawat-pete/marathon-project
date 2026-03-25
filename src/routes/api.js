const express = require('express');
const router = express.Router();
const marathonController = require('../controllers/marathonController');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public routes
router.get('/info', marathonController.getMarathonInfo);
router.get('/config', marathonController.getConfig);
router.post('/register', marathonController.registerRunner);
router.post('/admin/login', authController.login);

// Protected Admin routes (requireAuth middleware)
router.get('/admin/registrations', requireAuth, marathonController.getAllRegistrations);
router.get('/admin/dashboard', requireAuth, marathonController.getDashboardStats);

module.exports = router;
