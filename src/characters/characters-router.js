const express = require('express');
const path = require('path');
const CharactersService = require('./characters-service');
const { requireAuth } = require('../middleware/jwt-auth');
const charactersRouter = express.Router();

const jsonBodyParser = express.json();

charactersRouter.route('/').get((req, res, next) => {
  CharactersService.getCharacter(req.app.get('db'))
    .then((character) => {
      res.json(CharactersService.serializeCharacters(character));
    })
    .catch(next);
});

charactersRouter.route('/:user').all(requireAuth).all(checkCharactersExists).get((req, res) => {
  res.json(CharactersService.serializeCharacter(res.character));
});

async function checkCharactersExists(req, res, next) {
  try {
    const character = await CharactersService.getByUser(req.app.get('db'), req.user.id);
    if (!character)
      return res.status(404).json({
        error: "character doesn't exist"
      });

    res.character = character;
    next();
  } catch (error) {
    next(error);
  }
}

charactersRouter.route('/').post(requireAuth, jsonBodyParser, (req, res, next) => {
  const { name, gender, character_class, kingdom } = req.body;

  for (const field of [ 'name', 'gender', 'character_class', 'kingdom' ])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  const member_id = req.user.id;

  const newCharacter = {
    name,
    gender,
    character_class,
    kingdom,
    date_created: 'now()',
    member_id
  };

  function determineAtknDef(obj) {
    if (character_class === 'Knight') {
      obj.attack_power = 1000;
      obj.defense_power = 500;
      obj.weapon_equipped = 'Branch';
      return obj;
    } else if (character_class === 'Paladin') {
      obj.attack_power = 500;
      obj.defense_power = 1000;
      obj.weapon_equipped = 'Stick';
      return obj;
    } else {
      throw new Error('Something went wrong');
    }
  }
  const finalChara = determineAtknDef(newCharacter);

  CharactersService.insertCharacter(req.app.get('db'), finalChara)
    .then((character) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${character.id}`))
        .json(CharactersService.serializeCharacter(character));
    })
    .catch(next);
});

module.exports = charactersRouter;
