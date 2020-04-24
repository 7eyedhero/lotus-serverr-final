const xss = require('xss');
const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const MembersService = {
  hasMemberWithMemberName(db, user_name) {
    return db('triiibe_members').where({ user_name }).first().then((member) => !!member);
  },
  insertMember(db, newMember) {
    return db.insert(newMember).into('triiibe_members').returning('*').then(([ member ]) => member);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeMember(member) {
    return {
      id: member.id,
      user_name: xss(member.user_name),
      date_created: new Date(member.date_created)
    };
  }
};

module.exports = MembersService;
