const app = require('../src/app');

describe('App', () => {
  // default endpoint
  describe('GET /', () => {
    // happy test
    it('responds with 200 containing "Hello, world!"', () => {
      return supertest(app).get('/').expect(200, 'Hello, world!');
    });
  });
});
