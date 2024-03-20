// tests/unit/get.test.js
const hash = require('../../src/hash');
const request = require('supertest');
const { readFragment, readFragmentData } = require('../../src/model/data');
const app = require('../../src/app');

describe('Testing GET requests', () => {
  describe('GET /v1/fragments', () => {
    test('unauthenticated requests are denied', () =>
      request(app).get('/v1/fragments').expect(401));

    test('incorrect credentials are denied', () =>
      request(app)
        .get('/v1/fragments')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test('authenticated users get a fragments array', async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
    });

    test('GET /fragments?expand=1 returns full fragment metadata', async () => {
      const postRes = await request(app)
        .post('/v1/fragments/')
        .auth('user1@email.com', 'password1')
        .send('test')
        .set('Content-Type', 'application/json');

      const fragmentMetaData = await readFragment(
        hash('user1@email.com'),
        postRes.body.fragment.id
      );

      const getRes = await request(app)
        .get(`/v1/fragments?expand=1`)
        .auth('user1@email.com', 'password1');
      expect(getRes.body.status).toBe('ok');
      expect(Array.isArray(getRes.body.fragments)).toBe(true);
      expect(getRes.body.fragments.length).toEqual(1);
      expect(getRes.body.fragments[0]).toEqual(fragmentMetaData);
    });
  });

  describe('GET /v1/fragments/:id', () => {
    test('unauthenticated requests are denied', () =>
      request(app).get('/v1/fragments/1234').expect(401));

    test('incorrect credentials are denied', () =>
      request(app)
        .get('/v1/fragments/1234')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test('authenticated user can get a fragment by ID', async () => {
      const postRes = await request(app)
        .post('/v1/fragments/')
        .auth('user1@email.com', 'password1')
        .send('testing text')
        .set('Content-Type', 'text/markdown');
      const fragment = await readFragmentData(hash('user1@email.com'), postRes.body.fragment.id);
      const getRes = await request(app)
        .get(`/v1/fragments/${postRes.body.fragment.id}`)
        .auth('user1@email.com', 'password1');
      expect(getRes.statusCode).toBe(200);
      expect(getRes.text).toBe(fragment.toString());
    });

    test('invalid fragment ID for the GET request should give an appropriate error', async () => {
      const res = await request(app)
        .get('/v1/fragments/invalidID')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
      expect(res.body.error.message).toBe('Not found');
    });

    test('GET /v1/fragments/:id.ext - able to convert from Markdown to HTML', async () => {
      const postRes = await request(app)
        .post('/v1/fragments/')
        .auth('user1@email.com', 'password1')
        .send('# Markdown type test fragment')
        .set('Content-type', 'text/markdown');

      const getRes = await request(app)
        .get(`/v1/fragments/${postRes.body.fragment.id}.html`)
        .auth('user1@email.com', 'password1');
      expect(getRes.statusCode).toBe(200);
      expect(getRes.text).toEqual('<h1>Markdown type test fragment</h1>\n');
    });

    test('GET /v1/fragments/:id.ext - unsupported conversion attempt should give an appropriate error', async () => {
      const postRes = await request(app)
        .post('/v1/fragments/')
        .auth('user1@email.com', 'password1')
        .send('test fragment')
        .set('Content-type', 'text/plain');

      const getRes = await request(app)
        .get(`/v1/fragments/${postRes.body.fragment.id}.html`)
        .auth('user1@email.com', 'password1');
      expect(getRes.statusCode).toBe(415);
      expect(getRes.body.error.message).toBe('Conversion to unsupported type');
    });
  });

  describe('GET /v1/fragments/:id/info', () => {
    test('unauthenticated requests are denied', () =>
      request(app).get('/v1/fragments/1234/info').expect(401));

    test('incorrect credentials are denied', () =>
      request(app)
        .get('/v1/fragments/1234/info')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    test("authenticated user can get fragment's metadata by ID", async () => {
      const postRes = await request(app)
        .post('/v1/fragments/')
        .auth('user1@email.com', 'password1')
        .send('test')
        .set('Content-Type', 'application/json');

      const fragmentMetaData = await readFragment(
        hash('user1@email.com'),
        postRes.body.fragment.id
      );

      const getRes = await request(app)
        .get(`/v1/fragments/${postRes.body.fragment.id}/info`)
        .auth('user1@email.com', 'password1');
      expect(getRes.statusCode).toBe(200);
      expect(getRes.body.status).toBe('ok');
      expect(getRes.body.fragment).toEqual(fragmentMetaData);
    });

    test('invalid fragment ID for the GET request should give an appropriate error', async () => {
      const res = await request(app)
        .get('/v1/fragments/invalidID/info')
        .auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(404);
      expect(res.body.error.message).toBe('Not found');
    });
  });
});
