'use strict'

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

const port = 3500;

dotenv.config();

const mongoDb_URI = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(mongoDb_URI)
    .then(() => {
        app.listen(port)

        console.log(`Servidor ejecutándose en puerto ${port}`);
    })
    .catch(err => console.log(err));
