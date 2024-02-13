const request = require('supertest');
const app = require('../../src/app');

const { readFragment } = require('../../src/model/data');

describe('POST /v1/fragments', () => {
  test('unauthenticated requests result in 401', () =>
    request(app).post('/v1/fragments').expect(401));

  test('incorrect credentials result in 401', () =>
    request(app).post('/v1/fragments').auth('email', 'password').expect(401));

  test('authenticated user can post a fragment, resulting in correct response', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('testing text')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .expect(201);
    expect(res.headers.location).toBeDefined();
    expect(res.body.status).toBe('ok');
    const fragment = await readFragment(res.body.fragment.ownerId, res.body.fragment.id);
    expect(res.body.fragment).toEqual(fragment);
  });

  test('posting content of unsupported type results in 415', async () => {
    await request(app)
      .post('/v1/fragments')
      .send('<div>HTML</div>')
      .set('Content-Type', 'text/html')
      .auth('user1@email.com', 'password1')
      .expect(415);
  });
});
