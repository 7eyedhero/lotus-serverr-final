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

questsRouter.route('/:questId').all(requireAuth).all(checkQuestExists).get((req, res) => {
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

questsRouter.route('/').post(requireAuth, jsonBodyParser, (req, res, next) => {
  const { member_id, quest_id, quest_result } = req.body;

  for (const field of [ 'member_id', 'quest_id', 'quest_result' ])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  const results = {
    member_id,
    quest_id,
    quest_result
  };

  QuestsService.insertResults(req.app.get('db'), results)
    .then((result) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${result.id}`))
        .json(QuestsService.serializeQuest(result));
    })
    .catch(next);
});

module.exports = questsRouter;
