import express from 'express'
import fileUpload from 'express-fileupload';

import {UpLoadFile, GetFiles, GetFile, GetFileURL} from './s3.js';

const app = express();

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './upload'
}));

app.get('/files', async (req, res) => {
    const result = await GetFiles();

    res.json(result.Contents)
});

app.get('/files/:fileName', async (req, res) => {
    const result = await GetFileURL(req.params.fileName);
    res.json({
        url: result
    })
});

app.post('/files', async (req, res) => {
    await UpLoadFile(req.files.file);
    res.json({message: 'Archivo cargado correctamente'});
});

app.listen(3000);

console.log(`Server ejecutado el puerto ${3000}`);