const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const validator = require('validator');

// Register User
const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
        // Check if user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "User already registered with this email" });
        }

        // Hash password and Save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email';
        const result = await pool.query(query, [name.trim(), email.toLowerCase().trim(), hashedPassword]);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: result.rows[0]
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: "Server error. Could not register user." });
    }
};

// Login User
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: "Server error. Could not login." });
    }
};

module.exports = { register, login };
