const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');

// Define Routes
// POST /api/sms/save -> Saves an incoming SMS log to PostgreSQL
router.post('/save', smsController.saveSMS);

module.exports = router;
