const pool = require('../db');
const validator = require('validator');

// @desc    Save Incoming SMS from Android Sync
// @route   POST /api/sms/save
// @access  Public (Internal System Use)
exports.saveSMS = async (req, res) => {
    try {
        const { sender, message, timestamp } = req.body;

        // 1. Basic Sanitization & Validation
        if (!sender || !message || !timestamp) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: sender, message, or timestamp'
            });
        }

        const cleanSender = validator.trim(sender);
        const cleanMessage = validator.trim(message);
        
        // Convert timestamp to Date object (Android sends Long)
        const receivedAt = new Date(parseInt(timestamp));

        // 2. Database Insert
        const query = `
            INSERT INTO sms_logs (sender, message, received_at)
            VALUES ($1, $2, $3)
            RETURNING id
        `;

        const result = await pool.query(query, [cleanSender, cleanMessage, receivedAt]);

        // 3. Success Response
        res.status(201).json({
            success: true,
            id: result.rows[0].id
        });

    } catch (err) {
        console.error('SERVER ERROR (SMS Save):', err.message);
        res.status(500).json({
            success: false,
            error: 'Database error while saving SMS log'
        });
    }
};
