export class LogUtil {
    static info(text: string) { console.log(`[INFO] ${text}`); }
    static error(text: string) { console.error(`[ERROR] ${text}`); }
    static warn(text: string) { console.warn(`[WARN] ${text}`); }
}