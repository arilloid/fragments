const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {

    test('unauthenticated requests result in 401', async () => {
      await request(app)
        .delete(`/v1/fragments/someFragmentId'`)
        .expect(401);
    });
  
    test('authenticated user can delete a fragment resulting in expected response', async () => {
      // Create a fragment to get a valid ID
      const postRes = await request(app)
        .post('/v1/fragments')
        .send('Test fragment content')
        .set('Content-Type', 'text/plain')
        .auth('user1@email.com', 'password1')
        .expect(201);
  
      // Save the created ID for the delete request
      const createdFragmentId = postRes.body.fragment.id;
  
      // Delete the newly created fragment
      const delRes = await request(app)
        .delete(`/v1/fragments/${createdFragmentId}`)
        .auth('user1@email.com', 'password1')
        .expect(200);
  
      expect(delRes.body.status).toBe('ok');
    });
  
    test('deleting a non-existent fragment results in 404', async () => {
      const res = await request(app)
        .delete(`/v1/fragments/nonExistentFragmentId`)
        .auth('user1@email.com', 'password1')
        .expect(404);
        
        expect(res.body.status).toBe('error');
        expect(res.body.error.message).toBe('Not found');
    });
  });