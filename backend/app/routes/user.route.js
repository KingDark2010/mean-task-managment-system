const router = require('express').Router();
const User = require('../db/models/user.model')
const responseCreator = require('../helpers/response.helper');
const auth = require('../middleware/auth');
const uploader = require('../middleware/uploader');

//add new user
router.post('/adduser', auth.userAuth ,uploader.single('profileIamge'), async (req, res) => {
    try {
        const user = new User(req.body);
        console.log(user);
        console.log(req.file);
        user.profileIamge = req.file.path;
        console.log(user.profileIamge);
        await user.save();
        res.status(201).send(responseCreator(201, user, 'User created successfully'));
    }
    catch (err) {
        res.status(400).send(responseCreator(400, null, err.message));
    }
});

//activate user
router.post('/activate/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: true });
        console.log(user);
        if(!user) {
            return res.status(404).send(responseCreator(404, null, 'User not found'));
        }
        if(user.isActive) {
            return res.status(400).send(responseCreator(400, null, 'User already active'));
        }
        user.isActive = true;
        await user.save();
        res.status(200).send(responseCreator(200, user, 'User activated successfully'));
    }
    catch (err) {
        res.status(400).send(responseCreator(400, null, err.message));
    }
});


//user login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password);
        console.log(user);
        if(!user) {
            return res.status(401).send(responseCreator(401, null, 'Invalid email or password'));
        }
        if(user.isActive === false) {
            return res.status(401).send(responseCreator(401, null, 'User is not activated'));
        }
        const token = await user.generateAuthToken();
        res.send(responseCreator(200, { user, token }, 'Login successful'));
    }
    catch (err) {
        res.status(400).send(responseCreator(400, null, err.message));
    }
});


//user logout
router.post('/logout', auth.userAuth, async (req, res) => {
    try {
        console.log(req.user);
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send(responseCreator(200, null, 'Logout successful'));
    }
    catch (err) {
        res.status(500).send(responseCreator(500, null, err.message));
    }
});

// get all users
router.get('/', auth.adminAuth, async (req, res) => {
    try {
        const users = await User.find({});
        if(!users) {
            return res.status(404).send(responseCreator(404, null, 'Users not found'));
        }
        res.send(responseCreator(200, users, 'Users fetched successfully'));
    }
    catch (err) {
        res.status(500).send(responseCreator(500, null, err.message));
    }
});

// get user by id
router.get('/:id', auth.adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).send(responseCreator(404, null, 'User not found'));
        }
        res.send(responseCreator(200, user, 'User fetched successfully'));
    }
    catch (err) {
        res.status(500).send(responseCreator(500, null, err.message));
    }
});

// update user
router.patch('/:id', auth.adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!user) {
            return res.status(404).send(responseCreator(404, null, 'User not found'));
        }
        res.send(responseCreator(200, user, 'User updated successfully'));
    }
    catch (err) {
        res.status(500).send(responseCreator(500, null, err.message));
    }
});

// deactivate user
router.patch('/deactivate/:id', auth.adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if(!user) {
            return res.status(404).send(responseCreator(404, null, 'User not found'));
        }
        if(user.isActive === false) {
            return res.status(400).send(responseCreator(400, null, 'User already deactivated'));
        }
        user.isActive = false;
        await user.save();
        res.send(responseCreator(200, user, 'User deactivated successfully'));
    }
    catch (err) {
        res.status(500).send(responseCreator(500, null, err.message));
    }
});



//delete user


//model export
module.exports = router;