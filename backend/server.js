const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true               // allow cookies/auth headers
}));

// ✅ Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Routes
const authRoutes = require('./routes/auth');           // Handles login, register, profile
const issueRoutes = require('./routes/issueRoutes');   // Handles issue CRUD and analytics

app.use('/api/auth', authRoutes);       // e.g. /api/auth/login, /api/auth/profile
app.use('/api/issues', issueRoutes);    // e.g. /api/issues, /api/issues/stats

// ✅ Optional: Test Route for Axios
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// ✅ MongoDB Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));