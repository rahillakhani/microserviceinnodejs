import { FileFetcher } from '../services/fileFetcher';
import { JsonParser } from '../services/jsonParser';
import { DBHandler } from '../services/dbHandler';
import { LogUtil } from '../utils/logUtil';

(async () => {
    try {
        const allFiles = await FileFetcher.fetchKeys();

        for (const fileKey of allFiles) {
            const done = await DBHandler.checkProcessed(fileKey);
            if (done) {
                LogUtil.info(`Already done: ${fileKey}`);
                continue;
            }

            const downloadedPath = await FileFetcher.download(fileKey);
            const entries = await JsonParser.extractReviews(downloadedPath);

            for (const rec of entries) {
                await DBHandler.saveReview(rec);
            }

            await DBHandler.recordProcessed(fileKey);
            LogUtil.info(`Done processing: ${fileKey}`);
        }
    } catch (ex: any) {
        LogUtil.error(`Failure: ${ex.message}`);
    }
})();