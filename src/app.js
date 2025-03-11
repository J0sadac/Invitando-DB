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

// Configurar AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});


// Configurar Multer con S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `uploads/${Date.now()}_${file.originalname}`);
        }
    })
});

// Middleware para subir imágenes
app.use(upload.single("file"));


//rutas
app.use('/', router);

module.exports = app;