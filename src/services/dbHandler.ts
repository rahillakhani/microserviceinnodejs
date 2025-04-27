import { pgPool } from '../config/dbConn';
import { ReviewModel } from '../models/reviewModel';

export class DBHandler {
    static async saveReview(data: ReviewModel): Promise<void> {
        const sql = `INSERT INTO reviews (hotel_id, platform, hotel_name, comment, overall_by_providers)
                     VALUES ($1, $2, $3, $4, $5)`;
        const params = [
            data.hotelId,
            data.platform,
            data.hotelName,
            JSON.stringify(data.comment),
            JSON.stringify(data.overallByProviders),
        ];
        await pgPool.query(sql, params);
    }

    static async recordProcessed(fileName: string): Promise<void> {
        const sql = `INSERT INTO processed_files (filename) VALUES ($1)`;
        await pgPool.query(sql, [fileName]);
    }

    static async checkProcessed(fileName: string): Promise<boolean> {
        const res = await pgPool.query('SELECT 1 FROM processed_files WHERE filename = $1', [fileName]);
        return (res.rowCount ?? 0) > 0;
    }
}