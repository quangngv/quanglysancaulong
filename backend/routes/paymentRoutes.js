import express from 'express';
import PaymentService from '../services/PaymentService.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/', authenticateToken, async (req, res) => {
  try {
    const payment = await PaymentService.createPayment(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/confirm/:bookingId', authenticateToken, authorizeRole('Admin', 'Manager'), async (req, res) => {
  try {
    const payment = await PaymentService.confirmPayment(req.params.bookingId);
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const payments = await PaymentService.getAllPayments();
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await PaymentService.getPaymentById(req.params.id);
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/booking/:bookingId', authenticateToken, async (req, res) => {
  try {
    const payment = await PaymentService.getPaymentByBookingId(req.params.bookingId);
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
