const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const smsRoutes = require('./smsRoutes');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// SMS Logging (Publicly Accessible via Sync Worker)
router.use('/sms', smsRoutes);

// Booking Routes (Protected)
router.post('/bookings/create', authMiddleware, bookingController.createBooking);
router.get('/bookings/list', authMiddleware, bookingController.listBookings);

// Admin Routes (Placeholder for security)
router.get('/admin/bookings/all', bookingController.listAllBookings);
router.put('/admin/bookings/status', bookingController.updateBookingStatus);

module.exports = router;
