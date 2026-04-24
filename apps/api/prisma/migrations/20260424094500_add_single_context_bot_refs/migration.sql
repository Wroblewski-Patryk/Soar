ALTER TABLE "Bot"
ADD COLUMN "strategyId" TEXT,
ADD COLUMN "symbolGroupId" TEXT;

ALTER TABLE "Bot"
ADD CONSTRAINT "Bot_strategyId_fkey"
FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "Bot"
ADD CONSTRAINT "Bot_symbolGroupId_fkey"
FOREIGN KEY ("symbolGroupId") REFERENCES "SymbolGroup"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE INDEX "Bot_strategyId_idx" ON "Bot"("strategyId");
CREATE INDEX "Bot_symbolGroupId_idx" ON "Bot"("symbolGroupId");

WITH canonical_groups AS (
  SELECT
    bg."botId",
    bg."symbolGroupId",
    ROW_NUMBER() OVER (
      PARTITION BY bg."botId"
      ORDER BY bg."executionOrder" ASC, bg."createdAt" ASC, bg."id" ASC
    ) AS rn,
    COUNT(*) OVER (PARTITION BY bg."botId") AS candidate_count
  FROM "BotMarketGroup" bg
  WHERE bg."isEnabled" = true
    AND bg."lifecycleStatus" = 'ACTIVE'
),
canonical_group_pick AS (
  SELECT cg."botId", cg."symbolGroupId"
  FROM canonical_groups cg
  WHERE cg.rn = 1
    AND cg.candidate_count = 1
)
UPDATE "Bot" b
SET "symbolGroupId" = cgp."symbolGroupId"
FROM canonical_group_pick cgp
WHERE b."id" = cgp."botId"
  AND b."symbolGroupId" IS NULL;

WITH canonical_strategies AS (
  SELECT
    mgl."botId",
    mgl."strategyId",
    ROW_NUMBER() OVER (
      PARTITION BY mgl."botId"
      ORDER BY bg."executionOrder" ASC, bg."createdAt" ASC, mgl."priority" ASC, mgl."createdAt" ASC, mgl."id" ASC
    ) AS rn,
    COUNT(*) OVER (PARTITION BY mgl."botId") AS candidate_count
  FROM "MarketGroupStrategyLink" mgl
  JOIN "BotMarketGroup" bg ON bg."id" = mgl."botMarketGroupId"
  WHERE mgl."isEnabled" = true
    AND bg."isEnabled" = true
    AND bg."lifecycleStatus" = 'ACTIVE'
),
canonical_strategy_pick AS (
  SELECT cs."botId", cs."strategyId"
  FROM canonical_strategies cs
  WHERE cs.rn = 1
    AND cs.candidate_count = 1
)
UPDATE "Bot" b
SET "strategyId" = csp."strategyId"
FROM canonical_strategy_pick csp
WHERE b."id" = csp."botId"
  AND b."strategyId" IS NULL;

WITH legacy_single_context AS (
  SELECT
    bs."botId",
    MIN(bs."strategyId") AS "strategyId",
    MIN(bs."symbolGroupId") AS "symbolGroupId",
    COUNT(*) AS row_count,
    COUNT(DISTINCT bs."strategyId") AS strategy_count,
    COUNT(DISTINCT bs."symbolGroupId") AS symbol_group_count
  FROM "BotStrategy" bs
  WHERE bs."isEnabled" = true
  GROUP BY bs."botId"
),
legacy_pick AS (
  SELECT
    lsc."botId",
    lsc."strategyId",
    lsc."symbolGroupId"
  FROM legacy_single_context lsc
  WHERE lsc.row_count = 1
    AND lsc.strategy_count = 1
    AND lsc.symbol_group_count = 1
)
UPDATE "Bot" b
SET
  "strategyId" = COALESCE(b."strategyId", lp."strategyId"),
  "symbolGroupId" = COALESCE(b."symbolGroupId", lp."symbolGroupId")
FROM legacy_pick lp
WHERE b."id" = lp."botId"
  AND (b."strategyId" IS NULL OR b."symbolGroupId" IS NULL);
