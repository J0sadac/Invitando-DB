'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

var app = express();

var router = require('./router/router');

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    } 
});
app.use(multer({storage}).single('file'));

//rutas
app.use('/', router);

module.exports = app;