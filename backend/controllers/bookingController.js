const pool = require('../db');
const validator = require('validator');

// Create Booking
const createBooking = async (req, res) => {
    const { name, mobile, address, consumer_number, provider } = req.body;
    const userId = req.user.id; // From JWT middleware

    if (!name || !mobile || !address || !consumer_number || !provider) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const query = `
            INSERT INTO bookings (user_id, name, mobile, address, consumer_number, provider, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *
        `;
        const values = [
            userId, 
            validator.escape(name.trim()), 
            mobile.trim(), 
            validator.escape(address.trim()), 
            validator.escape(consumer_number.trim()), 
            provider.toUpperCase(),
            'PENDING' // Initial status
        ];
        
        const result = await pool.query(query, values);
        
        res.status(201).json({
            success: true,
            message: "Booking submitted successfully",
            booking: result.rows[0]
        });
    } catch (err) {
        console.error('Booking error:', err);
        res.status(500).json({ error: "Server error. Could not submit booking." });
    }
};

// List Bookings for User
const listBookings = async (req, res) => {
    const userId = req.user.id;

    try {
        const result = await pool.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json({
            success: true,
            total: result.rows.length,
            bookings: result.rows
        });
    } catch (err) {
        console.error('List bookings error:', err);
        res.status(500).json({ error: "Server error. Could not fetch bookings." });
    }
};

// Admin: List All Bookings
const listAllBookings = async (req, res) => {
    // Basic role check can be added if admin flag is present on users
    try {
        const result = await pool.query('SELECT b.*, u.email as user_email FROM bookings b JOIN users u ON b.user_id = u.id ORDER BY b.created_at DESC');
        res.json({
            success: true,
            bookings: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// Update Status (Admin)
const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;
    
    if (!['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    try {
        const result = await pool.query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [status, bookingId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json({ success: true, message: "Status updated", booking: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { createBooking, listBookings, listAllBookings, updateBookingStatus };
