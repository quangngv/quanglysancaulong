import express from 'express';
import CourtService from '../services/CourtService.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const courts = await CourtService.getAllCourts();
    res.json({ success: true, data: courts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/types', async (req, res) => {
  try {
    const types = await CourtService.getCourtTypes();
    res.json({ success: true, data: types });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/timeslots', async (req, res) => {
  try {
    const slots = await CourtService.getTimeSlots();
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/available', async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;
    const courts = await CourtService.getAvailableCourts(date, startTime, endTime);
    res.json({ success: true, data: courts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const court = await CourtService.getCourtById(req.params.id);
    res.json({ success: true, data: court });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin routes
router.post('/', authenticateToken, authorizeRole('Admin', 'Manager'), async (req, res) => {
  try {
    const court = await CourtService.createCourt(req.body);
    res.status(201).json({ success: true, data: court });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', authenticateToken, authorizeRole('Admin', 'Manager'), async (req, res) => {
  try {
    const court = await CourtService.updateCourt(req.params.id, req.body);
    res.json({ success: true, data: court });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    await CourtService.deleteCourt(req.params.id);
    res.json({ success: true, message: 'Court deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
