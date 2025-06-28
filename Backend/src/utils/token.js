const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

const generateToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
    };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
};