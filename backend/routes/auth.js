const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


router.post('/register', async(req, res) => {
   try{
     const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;

    if(!username || !password || !role){
        return res.status(400).json({
            message: "All feilds are required"
        })
    }

    const existingUser = await User.findOne({username})
    if (existingUser){
        return res.status(409).json({
            message: "Username already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username: username, 
        password: hashedPassword, 
        role:role
    })

    await user.save();

    res.status(201).json({
        message: "User Created"
    })
   } catch(err){
    console.log(err);
    res.status(500).json({
        message: "Server Error"
    })
   }
})

router.post('/login', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({username: username})

    if(!user || !await bcrypt.compare(password, user.password)){
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.json({
        token
    })
})

module.exports = router;