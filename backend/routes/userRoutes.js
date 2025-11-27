import express from 'express';
import UserService from '../services/UserService.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', async (req, res) => {
  try {
    const user = await UserService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const result = await UserService.login(Email, Password);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
});

// Protected routes
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.UserID);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await UserService.updateUser(req.user.UserID, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin routes
router.get('/', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
