const mongoose = require('mongoose');
const validator = require('validator');
// Define the task schema
/*     ** task:
    type
    createdAt
    due date
    employee assigned
    manager created
    description file
    due date can't be in the past */
const taskSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true,
        trim: true,
        validate(value) {
            if (value.dueDate < Date.now()) {
                throw new Error('Due date can\'t be in the past');
            }
        }

    },
    employeeAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    managerCreated: {  // manager created the task
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //task progress
    progress: {
        type: Object,
        default: { progress: 0, status: 'Not Started' }
    },
    descriptionFile: {
        type: String
    }
});


// Export the model
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;