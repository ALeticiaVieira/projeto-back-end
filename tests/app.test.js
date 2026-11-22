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

    it('deve impedir acesso sem token ao criar produto', async () => {
        const response = await request(app)
            .post('/v1/product')
            .send({
                name: 'Produto Teste',
                slug: 'produto-teste',
                price: 100,
                price_with_discount: 90
            });

        expect(response.status).toBe(401);
    });
});