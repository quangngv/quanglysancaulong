import express from 'express';
import BookingService from '../services/BookingService.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - all booking routes require authentication
router.post('/', authenticateToken, async (req, res) => {
  try {
    const bookingData = { ...req.body, UserID: req.user.UserID };
    const booking = await BookingService.createBooking(bookingData);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await BookingService.getUserBookings(req.user.UserID);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/stats', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const stats = await BookingService.getBookingStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', authenticateToken, authorizeRole('Admin', 'Manager'), async (req, res) => {
  try {
    const bookings = await BookingService.getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await BookingService.getBookingById(req.params.id);
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch('/:id/status', authenticateToken, authorizeRole('Admin', 'Manager'), async (req, res) => {
  try {
    const { Status } = req.body;
    const booking = await BookingService.updateBookingStatus(req.params.id, Status);
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await BookingService.cancelBooking(req.params.id);
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
