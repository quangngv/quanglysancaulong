import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { initDatabase } from './config/database.js';
import { seedInitialData } from './config/seed.js';

import userRoutes from './routes/userRoutes.js';
import courtRoutes from './routes/courtRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initDatabase();
    console.log('Seeding initial data...');
    await seedInitialData();
    app.listen(PORT, () => {
      console.log('\n✓✓✓ Server started successfully! ✓✓✓');
      console.log(`Server is running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log('\nDefault admin account:');
      console.log('Email: admin@example.com');
      console.log('Password: admin123\n');
    });
  } catch (error) {
    console.error('\n✗✗✗ Failed to start server ✗✗✗');
    console.error('Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. MySQL is running (Start XAMPP MySQL or MySQL service)');
    console.error('2. Database credentials in backend/.env are correct');
    console.error('3. Database "quanlysancaulong" exists');
    console.error('\nSee DATABASE_SETUP.md for detailed instructions\n');
    process.exit(1);
  }
}

startServer();
