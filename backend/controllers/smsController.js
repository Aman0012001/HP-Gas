const pool = require('../db');
const validator = require('validator');

// @desc    Register or Update Device on Sync
// @private
const checkOrUpdateDevice = async (deviceId, appVersion) => {
    const query = `
        INSERT INTO devices (device_id, app_version, last_seen)
        VALUES ($1, $2, NOW())
        ON CONFLICT (device_id) 
        DO UPDATE SET last_seen = NOW(), app_version = EXCLUDED.app_version
    `;
    await pool.query(query, [deviceId, appVersion]);
};

// @desc    Save Batch SMS from Android Sync (Multi-Device Support)
// @route   POST /api/sms/save
exports.saveSMSBatch = async (req, res) => {
    const client = await pool.connect();
    try {
        const { deviceId, appVersion, messages } = req.body;

        if (!deviceId || !messages || !Array.isArray(messages)) {
            return res.status(400).json({ success: false, error: 'Invalid batch format' });
        }

        // 1. Sync Device Metadata
        await checkOrUpdateDevice(deviceId, appVersion || '1.0.0');

        await client.query('BEGIN');

        // 2. Insert Batch
        for (const sms of messages) {
            const { sender, message, timestamp } = sms;
            const receivedAt = new Date(parseInt(timestamp));
            
            const insertQuery = `
                INSERT INTO sms_logs (device_id, sender, message, received_at)
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(insertQuery, [deviceId, validator.trim(sender), validator.trim(message), receivedAt]);
        }

        await client.query('COMMIT');
        res.status(201).json({ success: true, count: messages.length });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('BATCH SYNC ERROR:', err.message);
        res.status(500).json({ success: false, error: 'Database error during batch sync' });
    } finally {
        client.release();
    }
};

// @desc    Get SMS Logs (For Admin Dashboard)
// @route   GET /api/sms/list
exports.getSMSLogs = async (req, res) => {
    try {
        const { deviceId, sender, search, page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM sms_logs WHERE 1=1`;
        const params = [];

        if (deviceId) {
            params.push(deviceId);
            query += ` AND device_id = $${params.length}`;
        }
        if (sender) {
            params.push(sender);
            query += ` AND sender = $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            query += ` AND (message ILIKE $${params.length} OR sender ILIKE $${params.length})`;
        }

        query += ` ORDER BY received_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);
        res.status(200).json({ success: true, count: result.rows.length, data: result.rows });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get Real-time Stats
// @route   GET /api/sms/stats
exports.getStats = async (req, res) => {
    try {
        const totalSMS = await pool.query('SELECT COUNT(*) FROM sms_logs');
        const totalDevices = await pool.query('SELECT COUNT(*) FROM devices');
        const todaySMS = await pool.query("SELECT COUNT(*) FROM sms_logs WHERE created_at > NOW() - INTERVAL '24 hours'");

        res.status(200).json({
            success: true,
            totalSMS: totalSMS.rows[0].count,
            totalDevices: totalDevices.rows[0].count,
            todaySMS: todaySMS.rows[0].count
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
