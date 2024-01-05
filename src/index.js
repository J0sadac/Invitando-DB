'use strict'

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const port = 3500;

dotenv.config();

const mongoDb_URI = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(mongoDb_URI)
    .then(() => {
        app.listen(port);

        console.log("Conexion a la base de datos con exito");
    }).catch(err => console.log(err));