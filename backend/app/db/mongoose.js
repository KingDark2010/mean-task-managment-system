// getting-started.js
const mongoose = require('mongoose');
require('dotenv').config();
// i used the IP of localhost because some people have issues with the localhost stil localhost:27017 should works at least for me
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));