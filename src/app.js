'use strict'

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

var app = express();

var router = require('./router/router');

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const white_list = [
    'http://localhost:3500', 
    'http://localhost:3000', 
    'https://invitandoo.com',
    'http://192.168.100.85:3000'
];

app.use(cors({
    origin: white_list
}));

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