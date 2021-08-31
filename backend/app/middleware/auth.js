const User = require('../db/models/user.model');
const jwt = require('jsonwebtoken');
const responseCreator = require('../helpers/response.helper');
require('dotenv').config();

const userAuth = async(req,res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, process.env.ACTIVE_TASKS)
        const user = await User.findOne({_id:decodedToken._id, 'tokens.token':token})
        if(!user) throw new Error('please authintcate')
        req.user=user
        req.token = token
        next()        
    }
    catch(e){
        res.status(500).send({
            apistatus:false,
            data:e.message,
            message:"not authorized"
        })
    }
}

const adminAuth = async(req,res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, process.env.ACTIVE_TASKS)
        const user = await User.findOne({_id:decodedToken._id, 'tokens.token':token})
        if(!user) throw new Error('please authintcate')
        if(user.position === false) throw new Error('not authorized')
        req.user=user
        req.token = token
        next()        
    }
    catch(e){
        res.status(500).send({
            apistatus:false,
            data:e.message,
            message:"not authorized"
        })
    }
}

module.exports = {userAuth, adminAuth}