const router = require('express').Router();
const Task = require('../db/models/task.model');
const User = require('../db/models/user.model')
const responseCreator = require('../helpers/response.helper');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// add new task
router.post('/', auth.AuthAdmin, async (req, res) => {
    try {
        const task = await new task(req.body);
        const user = await User.findOne({ _id: req.body.employeeAssigned });
        console.log(user)
        console.log(task)
        }
    catch (error) {
        return response.status(500).send(responseCreator(500, null, error.message));
    }
});

// get all tasks
router.get('/', auth.adminAuth, async (req, res) => {
    try {
        const tasks = await Task.find({});
        if(!tasks){
            return response.status(404).send(responseCreator(404, null, 'Tasks not found'));
        }
        return response.status(200).send(responseCreator(200, tasks, 'Tasks fetched successfully'));
    }
    catch (error) {
        return response.status(500).send(responseCreator(500, null, error.message));
    }
});

// get task by id
router.get('/:id', auth.userAuth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const decodedToken = jwt.verify(token, process.env.ACTIVE_TASKS)
        const user = await User.findOne({_id:decodedToken._id, 'tokens.token':token})
        if(user._id == task.employeeAssigned || user._id == task.managerCreated){
            if(!task){
                return response.status(404).send(responseCreator(404, null, 'Task not found'));
            }
            return response.status(200).send(responseCreator(200, task, 'Task fetched successfully'));
        }
    }
    catch (error) {
        return response.status(500).send(responseCreator(500, null, error.message));
    }
});


// admin update task
router.patch('/:id', auth.adminAuth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!task){
            return response.status(404).send(responseCreator(404, null, 'Task not found'));
        }
        return response.status(200).send(responseCreator(200, task, 'Task updated successfully'));
    }
    catch (error) {
        return response.status(500).send(responseCreator(500, null, error.message));
    }
});

// user update task
router.patch('/:id/user', auth.userAuth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const decodedToken = jwt.verify(token, process.env.ACTIVE_TASKS)
        const user = await User.findOne({_id:decodedToken._id, 'tokens.token':token})
        if(user._id == task.employeeAssigned || user._id == task.managerCreated){
            if(!task){
                return response.status(404).send(responseCreator(404, null, 'Task not found'));
            }
            return response.status(200).send(responseCreator(200, task, 'Task updated successfully'));
        }
    }
    catch (error) {
        return response.status(500).send(responseCreator(500, null, error.message));
    }
});

// delete task
router.delete('/:id', auth.adminAuth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task){
            return response.status(404).send(responseCreator(404, null, 'Task not found'));
        }
        return response.status(200).send(responseCreator(200, task, 'Task deleted successfully'));
    }
    catch (error) {
        return response.status(500).send(responseCreator(500, null, error.message));
    }
}
);


module.exports = router;