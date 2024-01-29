// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('404 check', () => {

    test('requests for resources that cannot be found should return 404', async () => {
        const res = await request(app).get('/not-exist');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.status).toEqual('error');
        expect(res.body.error.message).toEqual('not found');
        expect(res.body.error.code).toEqual(404);
      });
  });