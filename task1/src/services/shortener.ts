import { customAlphabet } from 'nanoid';
import { saveUrlMapping, getLongUrl as dbGetLongUrl } from '../db/index';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export class ShortenerService {
    async shortenUrl(longUrl: string): Promise<string> {
        const shortCode = nanoid();
        await saveUrlMapping(longUrl, shortCode);
        return shortCode;
    }

    async getLongUrl(shortCode: string): Promise<string | null> {
        return dbGetLongUrl(shortCode);
    }
}