import { pool } from '../config/db';
import { Review } from '../models/review';

export class DBService {
    static async insertReview(review: Review): Promise<void> {
        const query = `INSERT INTO reviews (hotel_id, platform, hotel_name, comment, overall_by_providers)
                   VALUES ($1, $2, $3, $4, $5)`;
        const values = [
            review.hotelId,
            review.platform,
            review.hotelName,
            JSON.stringify(review.comment),
            JSON.stringify(review.overallByProviders),
        ];
        await pool.query(query, values);
    }

    static async markFileProcessed(filename: string): Promise<void> {
        const query = `INSERT INTO processed_files (filename) VALUES ($1)`;
        await pool.query(query, [filename]);
    }

    static async isFileProcessed(filename: string): Promise<boolean> {
        const result = await pool.query('SELECT 1 FROM processed_files WHERE filename = $1', [filename]);
        return (result.rowCount ?? 0) > 0;
    }
}