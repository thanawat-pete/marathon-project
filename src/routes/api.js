const express = require('express');
const router = express.Router();
const marathonController = require('../controllers/marathonController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public routes
router.get('/info', marathonController.getMarathonInfo);
router.post('/register', marathonController.registerRunner);

// Protected Admin routes (requireAuth middleware)
router.get('/admin/registrations', requireAuth, marathonController.getAllRegistrations);
router.get('/admin/dashboard', requireAuth, marathonController.getDashboardStats);

module.exports = router;
