const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Members Endpoints', function() {
  let db;

  const { testMembers } = helpers.makeMembersFixtures();
  const testMember = testMembers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST /api/members`, () => {
    context(`Member Validation`, () => {
      beforeEach('insert members', () => helpers.seedMembers(db, testMembers));

      const requiredFields = [ 'user_name', 'password' ];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          user_name: 'TEST_GHOST',
          password: 'test password'
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app).post('/api/members').send(registerAttemptBody).expect(400, {
            error: `Missing '${field}' in request body`
          });
        });
      });
      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
        const memberShortPassword = {
          user_name: 'TEST_GHOST',
          password: '1234567'
        };
        return supertest(app)
          .post('/api/members')
          .send(memberShortPassword)
          .expect(400, { error: `Password must be longer than 8 characters` });
      });
      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const memberLongPassword = {
          user_name: 'TEST_GHOST',
          password: '*'.repeat(73)
        };
        return supertest(app)
          .post('/api/members')
          .send(memberLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` });
      });
      it(`responds 400 error when password starts with spaces`, () => {
        const memberPasswordStartsSpaces = {
          user_name: 'TEST_GHOST',
          password: ' 1Aa!2Bb@'
        };
        return supertest(app)
          .post('/api/members')
          .send(memberPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` });
      });
      it(`responds 400 error when password ends with spaces`, () => {
        const memberPasswordEndsSpaces = {
          user_name: 'TEST_GHOST',
          password: '1Aa!2Bb@ '
        };
        return supertest(app)
          .post('/api/members')
          .send(memberPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` });
      });
      it(`responds 400 error when password isn't complex enough`, () => {
        const memberPasswordNotComplex = {
          user_name: 'TEST_GHOST',
          password: '11AAaabb'
        };
        return supertest(app)
          .post('/api/members')
          .send(memberPasswordNotComplex)
          .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` });
      });
      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
        const duplicateMember = {
          user_name: testMember.user_name,
          password: '11AAaa!!'
        };
        return supertest(app)
          .post('/api/members')
          .send(duplicateMember)
          .expect(400, { error: `Username already taken` });
      });
    });
    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newMember = {
          user_name: 'test user_name',
          password: '11AAaa!!',
          full_name: 'test full_name'
        };
        return supertest(app)
          .post('/api/members')
          .send(newMember)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property('id');
            expect(res.body.user_name).to.eql(newMember.user_name);
            expect(res.body).to.not.have.property('password');
            expect(res.headers.location).to.eql(`/api/members/${res.body.id}`);
            const expectedDate = new Date().toLocaleString('en', { timezone: 'UTC' });
            const actualDate = new Date(res.body.date_created).toLocaleString();
            expect(actualDate).to.eql(expectedDate);
          })
          .expect((res) =>
            db
              .from('triiibe_members')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then((row) => {
                expect(row.user_name).to.eql(newMember.user_name);
                const expectedDate = new Date().toLocaleString('en', { timezone: 'UTC' });
                const actualDate = new Date(row.date_created).toLocaleString();
                expect(actualDate).to.eql(expectedDate);

                return bcrypt.compare(newMember.password, row.password);
              })
              .then((compareMatch) => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });
});
