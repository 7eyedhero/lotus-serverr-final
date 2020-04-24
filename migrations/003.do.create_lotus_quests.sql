CREATE TABLE lotus_quests (
  id SERIAL PRIMARY KEY,
  quests_date TIMESTAMPTZ DEFAULT now(),
  quest_desc TEXT NOT NULL,
  quest_name TEXT NOT NULL,
  quest_content TEXT NOT NULL,
  quest_award TEXT NOT NULL,
  award_img TEXT,
  exp_value INTEGER NOT NULL,
  quest_target_attack INTEGER,
  quest_target_defense INTEGER,
  mission_type TEXT NOT NULL
);