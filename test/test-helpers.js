const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeMembersArray() {
  return [
    {
      id: 1,
      user_name: 'GHOST-1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 2,
      user_name: 'GHOST-2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 3,
      user_name: 'GHOST-3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z'
    }
  ];
}

function makeMembersFixtures() {
  const testMembers = makeMembersArray();
  //   const testThings = makeThingsArray(testUsers);
  //   const testReviews = makeReviewsArray(testUsers, testThings);
  return { testMembers };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      triiibe_members
      RESTART IDENTITY CASCADE`
  );
}

function seedMembers(db, members) {
  const preppedMembers = members.map((member) => ({
    ...member,
    password: bcrypt.hashSync(member.password, 1)
  }));
  return db.into('triiibe_members').insert(preppedMembers).then(() =>
    // update the auto sequence to stay in sync
    db.raw(`SELECT setval('triiibe_members_id_seq', ?)`, [ members[members.length - 1].id ])
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeMembersArray,
  makeMembersFixtures,
  cleanTables,
  seedMembers,
  makeAuthHeader
};
