const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthController {
    async register(req, res) {
        const { username, email, password, phonenumber,profilepic } = req.body;
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
                phonenumber,
                profilepic
            });
            await user.save();

            const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

            res.status(201).json({ token, user: { id: user._id, username, email, phonenumber,profilepic } });
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

            res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, phonenumber: user.phonenumber ,profilepic:user.profilepic} });
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
        const { password, ...userWithoutPassword } = req.user.toObject ? req.user.toObject() : req.user;
        res.status(200).json({ user: userWithoutPassword });
    }

    async googleLogin(req, res) {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Google token is required' });
        }

        try {
            // Verify Google token
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const { email, name } = payload;

            let user = await User.findOne({ email });
            if (!user) {
                // If user doesn't exist, create a new one
                user = new User({
                    username: name,
                    email,
                    password: bcrypt.hashSync("google-auth", 10), // Placeholder password
                    phonenumber: null // Assuming no phone number for Google login
                });
                await user.save();
            }

            const jwtToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

            res.status(200).json({ token: jwtToken, user: { id: user._id, username: user.username, email: user.email } });
        } catch (err) {
             console.error("Google Login Error:", err); 
            res.status(500).json({ message: 'Google login failed', error: err.message });
        }
    }
}

module.exports = new AuthController();