const jwt = require('jsonwebtoken');
const User = require('../models/user');
let config;
try {
    config = require('../config/config'); // Optional, if exists
} catch (e) {
    config = {};
}

const getTokenFromHeader = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;
    // Support both "Bearer <token>" and "<token>"
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    return authHeader;
};

const authMiddleware = async (req, res, next) => {
    const token = getTokenFromHeader(req);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const secret = process.env.JWT_SECRET || config.secret;
        const decoded = jwt.verify(token, secret);

        // Try to attach user if possible, else just userId
        if (User && User.findById) {
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = user;
        } else {
            req.userId = decoded.id;
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;