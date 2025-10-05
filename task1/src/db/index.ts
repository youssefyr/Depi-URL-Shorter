import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// store DB in a shared volume mounted at /data inside the container
const DATABASE_FILE = '/data/url_shortener.db';

export async function openDb() {
    return open({
        filename: DATABASE_FILE,
        driver: sqlite3.Database
    });
}

export async function initializeDb() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            long_url TEXT NOT NULL,
            short_code TEXT NOT NULL UNIQUE
        )
    `);
    await db.close();
}

export async function saveUrlMapping(longUrl: string, shortCode: string) {
    const db = await openDb();
    await db.run('INSERT INTO urls (long_url, short_code) VALUES (?, ?)', [longUrl, shortCode]);
    await db.close();
}

export async function getLongUrl(shortCode: string): Promise<string | null> {
    const db = await openDb();
    const result = await db.get('SELECT long_url FROM urls WHERE short_code = ?', [shortCode]);
    await db.close();
    return result ? result.long_url : null;
}