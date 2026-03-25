require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (if needed, e.g. the PHP/HTML ones could be served by Apache/Nginx, or we can serve static HTML from here)
app.use(express.static('../'));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Chombueng Marathon API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
