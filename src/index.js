require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Import routes
const apiRoutes = require('./routes/api');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (Relative path for Vercel)
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Chombueng Marathon API is running' });
});

// Connect DB and Start Server
connectDB().then(() => {
    if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
});

// Export for Vercel
module.exports = app;
