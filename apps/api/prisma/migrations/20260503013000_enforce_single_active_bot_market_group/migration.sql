DO $$
DECLARE
  conflict_bot_ids TEXT;
BEGIN
  SELECT string_agg(conflicting."botId", ', ' ORDER BY conflicting."botId")
  INTO conflict_bot_ids
  FROM (
    SELECT "botId"
    FROM "BotMarketGroup"
    WHERE "isEnabled" = true
      AND "lifecycleStatus" = 'ACTIVE'
    GROUP BY "botId"
    HAVING COUNT(*) > 1
  ) conflicting;

  IF conflict_bot_ids IS NOT NULL THEN
    RAISE EXCEPTION
      'BOTMULTI-03 migration blocked: bots have multiple enabled ACTIVE market groups: %',
      conflict_bot_ids;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "BotMarketGroup_one_active_scope_per_bot_idx"
ON "BotMarketGroup"("botId")
WHERE "isEnabled" = true
  AND "lifecycleStatus" = 'ACTIVE';
