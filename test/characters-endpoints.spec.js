const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Characters Endpoints', function() {
  let db;

  const { testMembers, testCharacters } = helpers.makeMembersFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('Protected endpoints', () => {
    beforeEach('insert characters', () => helpers.seedCharactersTables(db, testMembers, testCharacters));

    const protectedEndpoints = [
      {
        name: 'GET /api/characters/:character_id',
        path: '/api/characters/1'
      }
    ];

    protectedEndpoints.forEach((endpoint) => {
      describe(endpoint.name, () => {
        it(`responds 401 'Missing bearer token' when no bearer token`, () => {
          return supertest(app).get(endpoint.path).expect(401, { error: `Missing bearer token` });
        });

        it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
          const validUser = testMembers[0];
          const invalidSecret = 'bad-secret';
          return supertest(app)
            .get(endpoint.path)
            .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
            .expect(401, { error: 'Unauthorized request' });
        });

        it(`responds 401 'Unauthorized request 34' when invalid sub in payload`, () => {
          const invalidUser = { user_name: 'user-not-existy', id: 1 };
          return supertest(app)
            .get(endpoint.path)
            .set('Authorization', helpers.makeAuthHeader(invalidUser))
            .expect(401, { error: 'Unauthorized request 34' });
        });
      });
    });
  });

  describe('GET /api/characters', () => {
    context('Given no characters', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/characters').expect(200, []);
      });
    });

    context('Given there are characters in the database', () => {
      beforeEach('insert characters', () => helpers.seedCharactersTables(db, testMembers, testCharacters));

      it('responds with 200 and all of the characters', () => {
        const expectedCharacter = testCharacters.map((chara) => helpers.makeExpectedCharacter(testMembers, chara));
        return supertest(app).get('/api/characters').expect(200, expectedCharacter);
      });
    });

    describe('GET /api/characters/:Character_id', () => {
      context('Given no characters', () => {
        beforeEach(() => helpers.seedMembers(db, testMembers));

        it('responds with 404', () => {
          const CharacterId = 123456;
          return supertest(app)
            .get(
              `/api/characters
    /${CharacterId}`
            )
            .set('Authorization', helpers.makeAuthHeader(testMembers[0]))
            .expect(404, {});
        });
      });

      context('Given there are characters in the database', () => {
        beforeEach('insert characters', () => helpers.seedCharactersTables(db, testMembers, testCharacters));

        it('responds with 200 and the specified Character', () => {
          const CharacterId = 2;
          const expectedCharacter = helpers.makeExpectedCharacter(testMembers, testCharacters[CharacterId - 1]);

          return supertest(app)
            .get(
              `/api/characters
    /${CharacterId}`
            )
            .set('Authorization', helpers.makeAuthHeader(testMembers[0]))
            .expect(200, expectedCharacter);
        });
      });
    });
  });
});
