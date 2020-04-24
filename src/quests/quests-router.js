const express = require('express');
const path = require('path');
const QuestsService = require('./quests-service');
const { requireAuth } = require('../middleware/jwt-auth');
const questsRouter = express.Router();

const jsonBodyParser = express.json();

questsRouter.route('/').get((req, res, next) => {
  QuestsService.getQuests(req.app.get('db'))
    .then((quests) => {
      res.json(QuestsService.serializeQuests(quests));
    })
    .catch(next);
});

questsRouter.route('/:questId').all(checkQuestExists).get((req, res) => {
  res.json(QuestsService.serializeQuest(res.quest));
});

async function checkQuestExists(req, res, next) {
  try {
    const quest = await QuestsService.getById(req.app.get('db'), req.params.questId);
    if (!quest)
      return res.status(404).json({
        error: "quest doesn't exist"
      });

    res.quest = quest;
    next();
  } catch (error) {
    next(error);
  }
}

// charactersRouter.route('/').post(requireAuth, jsonBodyParser, (req, res, next) => {
//   const { name, gender, character_class, kingdom } = req.body;

//   for (const field of [ 'name', 'gender', 'character_class', 'kingdom' ])
//     if (!req.body[field])
//       return res.status(400).json({
//         error: `Missing '${field}' in request body`
//       });

//   const member_id = req.user.id;

//   const newCharacter = {
//     name,
//     gender,
//     character_class,
//     kingdom,
//     date_created: 'now()',
//     member_id
//   };

//   CharactersService.insertCharacter(req.app.get('db'), newCharacter)
//     .then((character) => {
//       res
//         .status(201)
//         .location(path.posix.join(req.originalUrl, `/${character.id}`))
//         .json(CharactersService.serializeCharacter(character));
//     })
//     .catch(next);
// });

module.exports = questsRouter;
