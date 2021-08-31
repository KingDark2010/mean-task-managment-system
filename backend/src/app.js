//require express 
const express = require('express');
const app = express();
require('dotenv').config();
// require user routes
const userRoutes = require('../app/routes/user.route');
//const taskRoutes = require('../app/routes/task.route');
require('../app/db/mongoose')

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(userRoutes)
//app.use('/task', taskRoutes)
Port = process.env.PORT || 3000;

module.exports = {
    app,
    Port
}