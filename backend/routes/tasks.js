const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../controllers/auth');
const { translateAliases } = require('../models/User');
const User = require('../models/User');

router.post('/add-task', auth, async(req, res) => {
    try {
        const title = req.body.title;
        const description = req.body.description;
        const status = req.body.status;
        const priority = req.body.priority;
        const assignedTo = req.body.assignedTo;

        const assignedUser = await User.findOne({
            username: assignedTo
        });

        if(!assignedUser) {
            return res.status(404).json({
                message: "Assigned User not found"
            });
        }

        const task = await Task.create({
            title: title,
            description: description,
            status: status,
            priority: priority,
            assignedTo: assignedUser._id
        });

        res.json({
            message: 'task created',
            task
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/task', auth, async(req, res) => {
    try {
        const userId = req.user;

        const tasks = await Task.find({
            assignedTo: userId
        });

        res.json({
            tasks
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/update-task/:id', auth, async(req, res) => {
    try{
        const taskId = req.params.id;
        const updates = req.body;

        if(updates.assignedTo){
            const assignedUser = await User.findOne({
                username: updates.assignedTo
            })
            if(!assignedUser){
                return res.status(404).json({
                    message: "Assigned user not found"
                })
            }
            updates.assignedTo = assignedUser._id
        }

        const task = await Task.findByIdAndUpdate(taskId, updates, {new: true})
        if(!task){
            return res.status(404).json({
                message: "Task not found"
            })
        }

        res.json({
            message: 'Task updated',
            task
        })
    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        })
    }
})

router.delete('/delete-task/:id', auth, async(req, res) => {
    try{
        const taskId = req.params.id;

        const task = await Task.findByIdAndDelete(taskId)
        if(!task){
            return res.status(404).json({
                message: "Task not found"
            })
        }

        res.json({
            message: 'Task deleted',
            task
        })
    } catch (err) {
        res.status(500).json({
            message: "Server Error"
        })
    }
})

module.exports = router;