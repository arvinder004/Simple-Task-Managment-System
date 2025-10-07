const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// endpoint to register a user with user role only
router.post('/register', async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ 
                message: "Username already exists" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username: username,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ 
            message: "User Created" 
        });
    } catch (err) {
        res.status(500).json({ 
            message: "Server Error" 
        });
    }
});

// endpoint to login user and admin
router.post('/login', async(req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.findOne({ 
            username: username 
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ 
                message: "Invalid Credentials" 
            });
        }

        const token = jwt.sign({
            id: user._id.toString(),
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ 
            message: "Server Error" 
        });
    }
});

module.exports = router;