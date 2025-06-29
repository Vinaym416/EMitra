const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 

class AuthController {
    async register(req, res) {
        const { username, email, password, phonenumber } = req.body;
        if (!username || !email || !password || !phonenumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
    
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

          
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username,
                email,
                password: hashedPassword,
                phonenumber
            });
            await user.save();

            const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

            res.status(201).json({ token, user: { id: user._id, username, email, phonenumber } });
        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }



    async login(req, res) {
        const { email, password, phonenumber } = req.body;
        if ((!email && !phonenumber) || !password) {
            return res.status(400).json({ message: 'Email or phonenumber and password are required' });
        }

        try {
            // Find user by email or phonenumber
            const user = await User.findOne(email ? { email } : { phonenumber });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

            res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, phonenumber: user.phonenumber } });
        } catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }

    async authenticate(req, res) {
        // This method assumes a middleware has set req.user if JWT is valid
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({ user: req.user });
    }

    async getProfile(req, res) {
        res.status(200).json({ user: req.user });
    }
}

module.exports = new AuthController();