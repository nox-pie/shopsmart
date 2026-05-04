const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });
});

describe('GET /api/products', () => {
    it('should return all products without search', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter by search query', async () => {
        const res = await request(app).get('/api/products?search=hoodie');
        expect(res.statusCode).toEqual(200);
        expect(res.body.some((p) => /hoodie/i.test(p.name))).toBe(true);
    });
});

describe('GET /api/products/:id', () => {
    it('should return 404 for unknown id', async () => {
        const res = await request(app).get('/api/products/unknown');
        expect(res.statusCode).toEqual(404);
    });

    it('should return a product for valid id', async () => {
        const res = await request(app).get('/api/products/m1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', 'm1');
    });
});

describe('Cart API', () => {
    beforeEach(async () => {
        await request(app).delete('/api/cart/m1');
    });

    it('GET /api/cart returns cart shape', async () => {
        const res = await request(app).get('/api/cart');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('items');
        expect(res.body).toHaveProperty('total');
    });

    it('POST /api/cart increases and decreases quantity with signed delta', async () => {
        let res = await request(app).post('/api/cart').send({ productId: 'm1', quantity: 3 });
        expect(res.statusCode).toEqual(200);
        expect(res.body.items.find((i) => i.product.id === 'm1').quantity).toBe(3);

        res = await request(app).post('/api/cart').send({ productId: 'm1', quantity: -1 });
        expect(res.statusCode).toEqual(200);
        expect(res.body.items.find((i) => i.product.id === 'm1').quantity).toBe(2);

        res = await request(app).post('/api/cart').send({ productId: 'm1', quantity: -2 });
        expect(res.statusCode).toEqual(200);
        expect(res.body.items.filter((i) => i.product.id === 'm1')).toHaveLength(0);
    });
});
