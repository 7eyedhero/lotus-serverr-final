BEGIN;

TRUNCATE
  lotus_quests
  RESTART IDENTITY CASCADE;

INSERT INTO lotus_quests (
  quest_desc,
  quest_name,
  quest_content,
  quest_award,
  award_img,
  exp_value,
  quest_target_attack,
  quest_target_defense,
  mission_type
)

VALUES ('Check community board for something to do, then do it.', 'Getting Started', 'Today, you decide that you are going to continue your training to become the greatest hero in the world. You know the best way to do that is to find ways to prove yourself by visiting the local community board and check to see if anyone has posted some kind of mission that you could do. Upon reaching the community board, you notice there is a dirty piece of paper pinned to it with what seems to be a photograph of a giant spider. The article was posted by the local guards, who requested assistance in finding and killing the beast, which was apparently terrorizing the citizens. You find this to be a wonderful oppurtunity, and happen to also know exactly where it is: the old well. You confidently reach the well and see the spider...', 'Giant Spider Head', './spiderhead.png', 500, 600, 600, 'attack_mission'), ('You hear a weird sound coming from your window...investigate.', 'In the Night...','While sleeping in your bed at night, you wake up suddenly to the sounds of a big crash coming from outside your room. Instinctively, you grab your weapon and prepare for the worst. You start to hear multiple voices approaching you, and the door bursts open. There stands not 5, not 6, but suprisingly, only one robber...with 6 heads. They are all bickering amongst themselves and when the center head finally notices your presence, they all silence and look upon you...', 'Head of Monster Robber', './robberhead.png', 500, 600, 600, 'defense_mission');

COMMIT;
