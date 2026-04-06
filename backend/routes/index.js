const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Booking Routes (Protected)
router.post('/bookings/create', authMiddleware, bookingController.createBooking);
router.get('/bookings/list', authMiddleware, bookingController.listBookings);

// Admin Routes (Placeholder for security)
router.get('/admin/bookings/all', bookingController.listAllBookings);
router.put('/admin/bookings/status', bookingController.updateBookingStatus);

module.exports = router;
