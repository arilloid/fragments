const request = require('supertest');
const app = require('../../src/app');

const { readFragment } = require('../../src/model/data');

describe('POST /v1/fragments', () => {
  const validTypes = [
    'text/plain',
    'text/plain; charset=utf-8',
    'text/markdown',
    'text/html',
    'text/csv',
    'application/json',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/avif',
    'image/gif'
  ];

  test('unauthenticated requests result in 401', () =>
    request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials result in 401', () =>
    request(app).post('/v1/fragments').auth('email', 'password').expect(401));

  validTypes.forEach((type) => {
    test(`authenticated user can post a fragment of type: ${type}, resulting in correct response`, async () => {
      const apiUrl = process.env.API_URL || 'http://localhost:8080';

      const res = await request(app)
        .post('/v1/fragments')
        .send('test fragment')
        .set('Content-Type', type)
        .auth('user1@email.com', 'password1')
        .expect(201);

      expect(res.headers.location).toBe(`${apiUrl}/v1/fragments/${res.body.fragment.id}`);
      expect(res.body.status).toBe('ok');

      const fragment = await readFragment(res.body.fragment.ownerId, res.body.fragment.id);
      expect(res.body.fragment).toEqual(fragment);
    });
  });

  test('posting content of unsupported type results in 415', async () => {
    await request(app)
      .post('/v1/fragments')
      .send('invalid type data')
      .set('Content-Type', 'invalid/type')
      .auth('user1@email.com', 'password1')
      .expect(415);
  });
});
