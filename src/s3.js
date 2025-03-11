import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {AWS_ACCES_KEY_ID, AWS_SECRET_ACCES_KEY, AWS_REGION, AWS_BUCKET_NAME} from './config';
import fs from 'fs'

const client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCES_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCES_KEY
    }
})


async function uploadFile(file){
    const stream = fs.createReadStream(file);
    const uploadParams ={
        Bucket: AWS_BUCKET_NAME,
        Key: 'Hola.png',
        Body: stream
    }

    const comand = new PutObjectCommand(uploadParams);
    const result = await client.send(comand)
}