import { s3Client } from '../config/s3Config';
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const BUCKET = process.env.S3_BUCKET_NAME || '';

export class FileFetcher {
    static async fetchKeys(): Promise<string[]> {
        const cmd = new ListObjectsV2Command({ Bucket: BUCKET });
        const output = await s3Client.send(cmd);
        return output.Contents?.map(obj => obj.Key || '').filter(k => k.endsWith('.jl')) || [];
    }

    static async download(key: string): Promise<string> {
        const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        const res = await s3Client.send(getCmd);
        const destPath = path.join('/tmp', key.replace('/', '_'));

        if (res.Body instanceof Readable) {
            const stream = fs.createWriteStream(destPath);
            res.Body.pipe(stream);

            await new Promise<void>((resolve, reject) => {
                stream.on('finish', () => resolve());
                stream.on('error', (err) => reject(err));
            });
        }
        return destPath;
    }

}