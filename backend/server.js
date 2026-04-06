const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const pool = require('./db');
const routes = require('./routes/index');
const initDb = require('./initDb');

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

// Root route
app.get('/', (req, res) => {
    res.json({ message: "Gas Booking Utility Platform API v2.0 is live" });
});

// Initialize DB schema, then start server
(async () => {
    try {
        // Verify connection
        const result = await pool.query('SELECT NOW()');
        console.log('Database connected at:', result.rows[0].now);

        // Run schema migrations
        await initDb();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
})();
