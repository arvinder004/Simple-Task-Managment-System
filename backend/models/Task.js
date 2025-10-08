const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    dueDate: {type: Date},
    status: {type: String, default: 'pending'},
    priority: {type: String, default: 'medium'},
    assignedTo: {type: mongoose.Schema.Types.ObjectId}
}, {timestamps: true});


module.exports = mongoose.model('Task', taskSchema);