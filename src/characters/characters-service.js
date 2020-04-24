const xss = require('xss');
const Treeize = require('treeize');

const CharactersService = {
  getCharacter(db) {
    return db
      .from('triiibe_characters AS chara')
      .select(
        'chara.id',
        'chara.name',
        'chara.gender',
        'chara.kingdom',
        'chara.character_class',
        'chara.date_created',
        'chara.member_id',
        'chara.attack_power',
        'chara.defense_power'
      );
  },
  getByUser(db, id) {
    return CharactersService.getCharacter(db).where('chara.member_id', id).first();
  },

  insertCharacter(db, newCharacter) {
    return db.insert(newCharacter).into('triiibe_characters').returning('*').then(([ character ]) => character);
  },
  serializeCharacters(characters) {
    return characters.map(this.serializeCharacter);
  },
  serializeCharacter(character) {
    const charaTree = new Treeize();
    const charaData = charaTree.grow([ character ]).getData()[0];
    return {
      id: charaData.id,
      name: xss(charaData.name),
      gender: charaData.gender,
      class: charaData.character_class,
      kingdom: charaData.kingdom,
      date_created: new Date(charaData.date_created),
      member_id: charaData.member_id,
      attack_power: charaData.attack_power,
      defense_power: charaData.defense_power
    };
  }
};

module.exports = CharactersService;
