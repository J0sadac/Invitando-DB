'use strict'

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import router from './router/router.js';

const app = express();

const white_list = [
    'http://localhost:3500',
    'http://localhost:3000',
    'https://invitandoo.com'
];

app.use(cors({
    origin: white_list
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './upload'
}));

app.use('/', router);

export default app;
