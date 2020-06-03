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

function makeCharactersArray() {
  return [
    {
      id: 1,
      name: 'test1',
      gender: 'Male',
      class: 'Knight',
      kingdom: 'Ignis',
      member_id: 1,
      attack_power: 500,
      defense_power: 500,
      intelligence: 500,
      weapon_equipped: 'test-weapon'
    },
    {
      id: 2,
      name: 'test2',
      gender: 'Male',
      class: 'Paladin',
      kingdom: 'Oceani',
      member_id: 2,
      attack_power: 500,
      defense_power: 500,
      intelligence: 500,
      weapon_equipped: 'test-weapon'
    },
    {
      id: 3,
      name: 'test3',
      gender: 'Female',
      class: 'Knight',
      kingdom: 'Ventus',
      member_id: 3,
      attack_power: 500,
      defense_power: 500,
      intelligence: 500,
      weapon_equipped: 'test-weapon'
    },
    {
      id: 4,
      name: 'test4',
      gender: 'Female',
      class: 'Paladin',
      kingdom: 'Terra',
      member_id: 4,
      attack_power: 500,
      defense_power: 500,
      intelligence: 500,
      weapon_equipped: 'test-weapon'
    }
  ];
}

function makeMembersFixtures() {
  const testMembers = makeMembersArray();
  const testCharacters = makeCharactersArray(testMembers);
  //   const testReviews = makeReviewsArray(testUsers, testThings);
  return { testMembers, testCharacters };
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

function seedCharactersTables(db, members, characters) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedMembers(trx, members);
    await trx.into('triiibe_characters').insert(characters);
    await trx.raw(`SELECT setval('triiibe_characters_id_seq', ?)`, [ characters[characters.length - 1].id ]);
  });
}

function makeExpectedCharacter(members, character) {
  const user = members.find((user) => user.id === character.user_id);

  return {
    id: character.id,
    name: character.name,
    gender: character.gender,
    class: character.class,
    kingdom: character.kingdom,
    member_id: character.member_id,
    attack_power: character.attack_power,
    defense_power: character.defense_power,
    intelligence: character.intelligence,
    weapon_equipped: character.weapon_equipped
  };
}

module.exports = {
  makeMembersArray,
  makeMembersFixtures,
  seedCharactersTables,
  cleanTables,
  seedMembers,
  makeAuthHeader,
  makeExpectedCharacter
};
