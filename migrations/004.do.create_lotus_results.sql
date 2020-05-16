CREATE TABLE lotus_results (
    member_id INTEGER REFERENCES triiibe_members(id) ON DELETE CASCADE NOT NULL,
    quest_id INTEGER REFERENCES lotus_quests(id) ON DELETE CASCADE NOT NULL,
    quest_result BOOLEAN DEFAULT NULL
);