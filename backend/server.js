const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const pool = require('./db');
const routes = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet()); // Basic security headers
app.use(cors());
app.use(bodyParser.json());

// Production Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // limit each IP to 100 requests per 15 min window
    message: { error: "Too many requests, please try again later." }
});
app.use('/api/', limiter);

// API Routes
app.use('/api', routes);

// Check DB Connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
    } else {
        console.log('Database connected at:', res.rows[0].now);
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: "Gas Booking Utility Platform API v2.0 is live" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
