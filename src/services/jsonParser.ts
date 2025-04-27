import fs from 'fs';
import readline from 'readline';
import { LogUtil } from '../utils/logUtil';
import { ReviewModel } from '../models/reviewModel';

export class JsonParser {
    static async extractReviews(file: string): Promise<ReviewModel[]> {
        const stream = fs.createReadStream(file);
        const reader = readline.createInterface({ input: stream, crlfDelay: Infinity });

        const parsed: ReviewModel[] = [];
        for await (const entry of reader) {
            try {
                const json = JSON.parse(entry);
                if (json.hotelId && json.platform && json.hotelName && json.comment) {
                    parsed.push(json);
                } else {
                    LogUtil.warn(`Incomplete record: ${entry}`);
                }
            } catch (e) {
                LogUtil.error(`Invalid JSON: ${entry}`);
            }
        }
        return parsed;
    }
}