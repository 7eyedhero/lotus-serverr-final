const express = require('express');
const path = require('path');
const MembersService = require('./members-service');
const { requireAuth } = require('../middleware/jwt-auth');
const membersRouter = express.Router();
const jsonBodyParser = express.json();

membersRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { password, user_name } = req.body;

  for (const field of [ 'user_name', 'password' ])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });
  const passwordError = MembersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  MembersService.hasMemberWithMemberName(req.app.get('db'), user_name)
    .then((hasMemberWithMemberName) => {
      if (hasMemberWithMemberName)
        return res.status(400).json({
          error: `Username already taken`
        });

      return MembersService.hashPassword(password).then((hashedPassword) => {
        const newMember = {
          user_name,
          password: hashedPassword,
          date_created: 'now()'
        };
        return MembersService.insertMember(req.app.get('db'), newMember).then((member) => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${member.id}`))
            .json(MembersService.serializeMember(member));
        });
      });
    })
    .catch(next);
});

module.exports = membersRouter;
