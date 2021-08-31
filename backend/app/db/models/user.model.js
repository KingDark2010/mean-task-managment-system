//require mongooose
const mongoose = require('mongoose');
//require validator
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//create user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 6,
        //validate that username is only letters
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error('Username can only contain letters');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        match: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"),
        //validate that password doesn't have password in it
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Password cannot contain password');
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        //validate that email is valid
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        //validate that phone number is valid Egyptian phone number
        validate(value) {
            if (!validator.isMobilePhone(value, 'ar-EG')) {
                throw new Error('Phone number is invalid');
            }
        }
    },
    position: {
        type: Boolean, //true for admin, false for user
        required: true,
        default: false
    },
    profileIamge: {
        type: String,
        trim: true
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    isActive: {
        type: Boolean,
        default: false
    }
});

//pre save password hash before saving to database
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};

//generate token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.ACTIVE_TASKS);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};


const User = mongoose.model('User', userSchema);

module.exports = User;