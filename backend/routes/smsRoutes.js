const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

// Define Routes
// POST /api/sms/save -> Saves batch SMS logs with device tracking
router.post('/save', smsController.saveSMSBatch);

// GET /api/sms/list -> Fetch paginated logs (Dashboard)
router.get('/list', smsController.getSMSLogs);

// GET /api/sms/stats -> Real-time analytics (Dashboard)
router.get('/stats', smsController.getStats);

module.exports = router;
