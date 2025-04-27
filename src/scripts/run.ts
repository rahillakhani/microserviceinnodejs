import {S3Service} from '../services/s3services';
import {ParserService} from '../services/parserService';
import {DBService} from '../services/dbService';
import {Logger} from '../utils/logger';

(async () => {
    try {
        const files = await S3Service.listFiles();

        for (const file of files) {
            const alreadyProcessed = await DBService.isFileProcessed(file);
            if (alreadyProcessed) {
                Logger.info(`File already processed: ${file}`);
                continue;
            }

            const localPath = await S3Service.downloadFile(file);
            const reviews = await ParserService.parseFile(localPath);

            for (const review of reviews) {
                await DBService.insertReview(review);
            }

            await DBService.markFileProcessed(file);
            Logger.info(`Processed file: ${file}`);
        }
    } catch (error: any) {
        Logger.error(`Run failed: ${error.message}`);
    }
})();