const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  let fragmentId;
  const fragmentData = 'Test text';
  const updatedData = 'Updated test text';
  const contentType = 'text/plain';

  // Create a fragment to get a valid ID (before each test)
  beforeAll(async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .send(fragmentData)
      .set('Content-Type', contentType)
      .auth('user1@email.com', 'password1')
      .expect(201);

    fragmentId = postRes.body.fragment.id;
  });

  test('unauthenticated requests result in 401', async () => {
    await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .send(updatedData)
      .set('Content-Type', contentType)
      .expect(401);
  });

  test('updating a fragment with incorrect content type results in 400', async () => {
    await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .send(updatedData)
      // Using the mismatching content type
      .set('Content-Type', 'application/json')
      .auth('user1@email.com', 'password1')
      .expect(400);
  });

  test('updating a non-existent fragment results in 404', async () => {
    await request(app)
      .put(`/v1/fragments/nonExistentFragmentId`)
      .send(updatedData)
      .set('Content-Type', contentType)
      .auth('user1@email.com', 'password1')
      .expect(404);
  });

  test('authenticated user can update a fragment resulting in expected response', async () => {
    const res = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .send(updatedData)
      .set('Content-Type', contentType)
      .auth('user1@email.com', 'password1')
      .expect(200);

    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toEqual(
      expect.objectContaining({
        id: fragmentId,
        ownerId: expect.any(String),
        created: expect.any(String),
        updated: expect.any(String),
        type: contentType,
        size: updatedData.length,
      })
    );
  });
});
