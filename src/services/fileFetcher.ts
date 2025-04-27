import { s3Client } from '../config/s3Config';
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { LogUtil } from '../utils/logUtil';

const BUCKET = process.env.S3_BUCKET_NAME || '';
const MAX_RETRIES = 3;

export class FileFetcher {
    static async fetchKeys(): Promise<string[]> {
        const cmd = new ListObjectsV2Command({ Bucket: BUCKET });
        const output = await s3Client.send(cmd);
        return output.Contents?.map(obj => obj.Key || '').filter(k => k.endsWith('.jl')) || [];
    }

    static async download(key: string): Promise<string> {
        const destPath = path.join('/tmp', key.replace('/', '_'));

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
                const res = await s3Client.send(getCmd);

                if (res.Body instanceof Readable) {
                    const stream = fs.createWriteStream(destPath);
                    res.Body.pipe(stream);

                    await new Promise<void>((resolve, reject) => {
                        stream.on('finish', () => resolve());
                        stream.on('error', (err) => reject(err));
                    });
                }

                return destPath;
            } catch (err: any) {
                LogUtil.error(`Download attempt ${attempt} for ${key} failed: ${err.message}`);
                if (attempt === MAX_RETRIES) {
                    throw new Error(`Failed to download ${key} after ${MAX_RETRIES} attempts`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }

        throw new Error(`Unreachable code reached while downloading ${key}`);
    }
}