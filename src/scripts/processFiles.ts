import { FileFetcher } from '../services/fileFetcher';
import { JsonParser } from '../services/jsonParser';
import { DBHandler } from '../services/dbHandler';
import { LogUtil } from '../utils/logUtil';

const CONCURRENCY_LIMIT = 5;
const MAX_DB_RETRIES = 3;

async function safeDbInsert(review: any): Promise<void> {
    for (let attempt = 1; attempt <= MAX_DB_RETRIES; attempt++) {
        try {
            await DBHandler.saveReview(review);
            return;
        } catch (err: any) {
            LogUtil.error(`DB insert attempt ${attempt} failed: ${err.message}`);
            if (attempt === MAX_DB_RETRIES) {
                throw new Error(`Failed to insert review after ${MAX_DB_RETRIES} attempts`);
            }
            await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
    }
}

async function processFile(fileKey: string): Promise<void> {
    try {
        const alreadyDone = await DBHandler.checkProcessed(fileKey);
        if (alreadyDone) {
            LogUtil.info(`Already processed: ${fileKey}`);
            return;
        }

        const filePath = await FileFetcher.download(fileKey);
        const reviews = await JsonParser.extractReviews(filePath);

        for (const review of reviews) {
            await safeDbInsert(review);
        }

        await DBHandler.recordProcessed(fileKey);
        LogUtil.info(`Successfully processed: ${fileKey}`);
    } catch (error: any) {
        LogUtil.error(`Error processing file ${fileKey}: ${error.message}`);
    }
}

(async () => {
    try {
        const allFiles = await FileFetcher.fetchKeys();

        for (let i = 0; i < allFiles.length; i += CONCURRENCY_LIMIT) {
            const batch = allFiles.slice(i, i + CONCURRENCY_LIMIT);
            await Promise.all(batch.map(fileKey => processFile(fileKey)));
        }

    } catch (ex: any) {
        LogUtil.error(`Failure in overall run: ${ex.message}`);
    }
})();