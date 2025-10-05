import request from 'supertest';
import app from '../src/app'; // Adjust the path as necessary
import { Database } from '../src/db/index'; // Adjust the path as necessary

describe('URL Shortener Service', () => {
    beforeAll(async () => {
        await Database.initialize(); // Initialize the database connection
    });

    afterAll(async () => {
        await Database.close(); // Close the database connection
    });

    describe('POST /shorten', () => {
        it('should shorten a long URL', async () => {
            const response = await request(app)
                .post('/shorten')
                .send({ longUrl: 'https://www.example.com' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('shortCode');
        });

        it('should return an error for invalid URL', async () => {
            const response = await request(app)
                .post('/shorten')
                .send({ longUrl: 'invalid-url' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /:short_code', () => {
        it('should redirect to the long URL', async () => {
            const longUrl = 'https://www.example.com';
            const shortenResponse = await request(app)
                .post('/shorten')
                .send({ longUrl });

            const shortCode = shortenResponse.body.shortCode;

            const response = await request(app).get(`/${shortCode}`);
            expect(response.status).toBe(302); // Check for redirect status
            expect(response.headers.location).toBe(longUrl); // Check redirect location
        });

        it('should return a 404 for non-existent short code', async () => {
            const response = await request(app).get('/nonexistent');
            expect(response.status).toBe(404);
        });
    });
});