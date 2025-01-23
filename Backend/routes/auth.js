const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User  already exists" });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

      
        res.status(201).json({ message: "User  created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email,   password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

       
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '18h' });
        res.json({ token, user });
    } catch (error) {
        console.error('Login error:', error); 
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;