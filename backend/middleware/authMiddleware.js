const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Access Denied. No token provided.' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ error: 'Access Denied. Malformed token.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user details (id, role etc) to request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};
