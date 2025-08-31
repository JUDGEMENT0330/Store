const request = require('supertest');
const app = require('../server'); // Import the actual app

describe('GET /', () => {
    it('should respond with a 200 status code and a welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('FashionHub API is running...');
    });
});
