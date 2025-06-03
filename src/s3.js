import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import {AWS_ACCES_KEY_ID, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRET_ACCES_KEY} from './config.js'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import fs from 'fs';
import fsExtra from "fs-extra";

const client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCES_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCES_KEY
    }
});

export async function UpLoadFile(file){
    const stream = fs.createReadStream(file.tempFilePath);
    const upLoadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    };

    console.log(file.tempFilePath)

    const command = new PutObjectCommand(upLoadParams);
    const result= await client.send(command);

    await fsExtra.unlink(file.tempFilePath);
};

export async function GetFiles(){
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    }); 

    return await client.send(command);
};

export async function GetFile(fileName) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    });

    return await client.send(command);
};

export async function GetFileURL(fileName) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName
    });

    return await getSignedUrl(client, command, {expiresIn: 3600});
}