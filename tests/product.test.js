const request = require('supertest');
const app = require('../src/app');

describe('API Digital Store', () => {
    it('deve retornar mensagem de funcionamento', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            mensagem: 'API Digital Store funcionando!'
        });
    });
});