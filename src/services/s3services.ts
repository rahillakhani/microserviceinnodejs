import {s3} from '../config/s3';
import {GetObjectCommand, ListObjectsV2Command} from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import {Readable} from 'stream';

const BUCKET_NAME = process.env.S3_BUCKET_NAME || '';

export class S3Service {
    static async listFiles(): Promise<string[]> {
        const command = new ListObjectsV2Command({Bucket: BUCKET_NAME, Prefix: ''});
        const data = await s3.send(command);
        return data.Contents?.map(item => item.Key || '').filter(key => key.endsWith('.jl')) || [];
    }

    static async downloadFile(key: string): Promise<string> {
        const command = new GetObjectCommand({Bucket: BUCKET_NAME, Key: key});
        const data = await s3.send(command);
        const filePath = path.join('/tmp', key.replace('/', '_'));

        if (data.Body instanceof Readable) {
            const writeStream = fs.createWriteStream(filePath);
            data.Body.pipe(writeStream);

            await new Promise((resolve, reject) => {
                // @ts-ignore
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
        }

        return filePath;
    }
}