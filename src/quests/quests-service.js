const Treeize = require('treeize');

const QuestsService = {
  getQuests(db, id) {
    return db
      .from('lotus_quests AS qust')
      .select(
        'qust.id',
        'qust.quests_date',
        'qust.quest_desc',
        'qust.quest_name',
        'qust.quest_content',
        'qust.quest_award',
        'qust.award_img',
        'qust.exp_value',
        'qust.quest_target_attack',
        'qust.quest_target_defense',
        'qust.mission_type',
        'rslt.quest_result'
      )
      .leftJoin(
        function() {
          this.select('*').from('lotus_results').where('member_id', id).as('rslt');
        },
        'qust.id',
        'rslt.quest_id'
      );
  },

  getById(db, id) {
    return db.from('lotus_quests').select('*').where('id', id).first();
  },
  insertResults(db, results) {
    return db.insert(results).into('lotus_results').returning('*').then(([ results ]) => results);
  },
  serializeQuests(quests) {
    return quests.map(this.serializeQuest);
  },
  serializeQuest(quest) {
    const qustTree = new Treeize();
    const qustData = qustTree.grow([ quest ]).getData()[0];
    return {
      id: qustData.id,
      date: qustData.quests_date,
      desc: qustData.quest_desc,
      name: qustData.quest_name,
      content: qustData.quest_content,
      award: qustData.quest_award,
      award_img: qustData.award_img,
      exp_value: qustData.exp_value,
      target_atk: qustData.quest_target_attack,
      target_def: qustData.quest_target_defense,
      mission_type: qustData.mission_type,
      result: qustData.quest_result,
      member_id: qustData.member_id
    };
  }
};

module.exports = QuestsService;
