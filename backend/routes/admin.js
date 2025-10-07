const express = require("express")
const router = express.Router()
const User = require('../models/User')
const Task = require('../models/Task')
const bcrypt = require('bcryptjs')
const isAdmin = require("../controllers/isAdmin");
const auth = require('../controllers/auth')

/*
Admins will be added directly in the database
Admins cannot directly register themselves in the app
Admins can login through the same endpoint as other users
 */

// endpoint to allow admin to view users
router.get('/view-users', auth, isAdmin, async(req, res) => {
    try{
        const users = await User.find({
            role: {$ne: 'admin'}
        });
        res.json({
            users
        })
    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        })
    }
})

// endpoint to allow admin to add users
router.post('/add-user', auth, isAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'Username already exists' 
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            username, 
            password: hashedPassword, 
            role 
        });
        await user.save();
        res.status(201).json({ 
            message: 'User created', user 
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Server Error' 
        });
    }
});

// endpoint to allow admin to update users
router.put('/update-user/:id', auth, isAdmin, async (req, res) => {
    try {
        const updates = req.body;
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// endpoint to allow admin to delete users
router.delete('/delete-user/:id', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ 
            message: 'Server Error' 
        });
    }
});


// endpoint to allow admin to view task for a single user
router.get('/user/:id/tasks', auth, isAdmin, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.params.id });
        res.json({ tasks });
    } catch (err) {
        res.status(500).json({ 
            message: 'Server Error' 
        });
    }
});

// endpoint to allow admin to add task for a single user
router.post('/user/:id/tasks', auth, isAdmin, async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }
        const task = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo: user._id
        });
        await task.save();
        res.status(201).json({ 
            message: 'Task created', task 
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Server Error' 
        });
    }
});

// endpoint to allow admin to update task for a single user
router.put('/user/:id/tasks/:taskId', auth, isAdmin, async (req, res) => {
    try {
        const updates = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, assignedTo: req.params.id },
            updates,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }
        res.json({ message: 'Task updated', task });
    } catch (err) {
        res.status(500).json({ 
            message: 'Server Error' 
        });
    }
});

// endpoint to allow admin to delete task for a single user
router.delete('/user/:id/tasks/:taskId', auth, isAdmin, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.taskId, assignedTo: req.params.id });
        if (!task) {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }
        res.json({ 
            message: 'Task deleted' 
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Server Error' 
        });
    }
});


module.exports = router;