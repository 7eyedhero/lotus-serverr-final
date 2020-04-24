CREATE TABLE triiibe_characters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,
  gender TEXT NOT NULL,
  character_class TEXT NOT NULL,
  kingdom TEXT NOT NULL,
  attack_power INTEGER,
  defense_power INTEGER,
  weapon_equipped TEXT,
  date_created TIMESTAMPTZ DEFAULT now(),
  date_modified TIMESTAMPTZ,
  member_id INTEGER REFERENCES triiibe_members(id) ON DELETE CASCADE NOT NULL
);