import fs from 'fs';
import readline from 'readline';
import {Logger} from '../utils/logger';
import {Review} from '../models/review';

export class ParserService {
    static async parseFile(filePath: string): Promise<Review[]> {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});

        const reviews: Review[] = [];
        for await (const line of rl) {
            try {
                const json = JSON.parse(line);
                if (json.hotelId && json.platform && json.hotelName && json.comment) {
                    reviews.push(json);
                } else {
                    Logger.warn(`Missing required fields: ${line}`);
                }
            } catch (error) {
                Logger.error(`Malformed line: ${line}`);
            }
        }
        return reviews;
    }
}