'use strict'

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

var app = express();

var router = require('./router/router');

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const white_list = [
    'http://localhost:3500', 
    'http://localhost:3000', 
    'https://invitandoo.com',
    'http://192.168.100.85:3000',
    'http://192.168.100.87:3000',
    'http://192.168.100.97:3000'
];

app.use(cors({
    origin: white_list
}));


//rutas
app.use('/', router);

module.exports = app;