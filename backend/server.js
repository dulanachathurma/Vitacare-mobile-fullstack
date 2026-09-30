require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');
const metricRoutes = require('./routes/metricRoutes');

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev-only-secret-change-me';
  console.warn('JWT_SECRET is not set - using an insecure development secret.');
}

const app = express();

app.use(cors());
// 1mb so a resized profile photo (base64) fits in the request body
app.use(express.json({ limit: '1mb' }));

app.get('/api/ping', (req, res) => res.json({ status: 'ok', app: 'HealthPulse AI' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/metrics', metricRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found' }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(400).json({ code: 'INVALID_INPUT', message: 'Invalid data' });
  }
  res.status(500).json({ code: 'SERVER_ERROR', message: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log('HealthPulse API running on http://localhost:' + PORT));
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
