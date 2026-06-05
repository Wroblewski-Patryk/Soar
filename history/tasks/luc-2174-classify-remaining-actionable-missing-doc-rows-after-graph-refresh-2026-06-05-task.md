# Task

## Header
- ID: LUC-2174
- Title: [Soar][Architecture Repair][Docs] Classify remaining actionable missing-doc rows after June 5 graph refresh
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Depends on: prior architecture-awareness doc-link repair lanes
- Priority: P2
- Module Confidence Rows: Architecture Evidence Graph, API root/auth/wallets/backtests/bots/engine/orders documentation traceability
- Requirement Rows: not applicable
- Quality Scenario Rows: documentation traceability and architecture-awareness freshness
- Risk Rows: documentation drift / scanner relation incompleteness
- Operation Mode: BUILDER
- Mission ID: LUC-2174-REMAINING-ACTIONABLE-MISSING-DOC-ROWS-2026-06-05
- Mission Status: VERIFIED

## Context
The June 5 architecture-awareness refresh still reported `72` actionable implementation entities without inferred docs after [LUC-2165](/LUC/issues/LUC-2165). The current issue was scoped to classify the remaining actionable missing-doc rows and convert the next backend helper families into scanner-readable documentation relations.

## Goal
Classify the current top actionable missing-doc rows, attach them to existing owner documentation, refresh the architecture-awareness exports, and record the remaining backlog truth without changing runtime behavior.

## Scope
- `docs/architecture/relations/documentation-links.csv`
- `docs/modules/api-root.md`
- `docs/modules/api-auth.md`
- `docs/modules/api-wallets.md`
- `docs/modules/api-backtests.md`
- `docs/modules/api-bots.md`
- `docs/modules/api-engine.md`
- `docs/modules/api-orders.md`
- generated architecture-awareness exports and status reports
- project state ledgers for this issue

## Implementation Plan
1. Read the scoped wake payload and current architecture-awareness report.
2. Map the top actionable backend route/helper rows to existing canonical owner docs.
3. Add direct documentation-link rows and concise owner-doc classification tables.
4. Refresh architecture-awareness exports.
5. Run targeted relation readback, graph generation, strict drift, docs parity, and diff checks.
6. Update local task/state evidence and close the Paperclip issue.

## Acceptance Criteria
- Targeted missing-doc rows have direct documentation links with no duplicate exact CSV rows.
- Owner docs describe why the mapped helper families belong to those modules.
- Architecture-awareness refresh shows reduced actionable missing-doc count.
- Architecture graph drift and docs parity pass.
- No runtime, deploy, env, database, secret, exchange, or live-trading action occurs.

## Definition of Done
- [x] Direct documentation links added for the selected actionable missing-doc families.
- [x] Owner module docs updated with classification context.
- [x] Architecture-awareness and graph validation passed.
- [x] Residual missing-doc backlog recorded.

## Validation Evidence
- Targeted CSV duplicate/readback:
  - `rows=239`
  - `duplicates=0`
  - `targets=40 linked=40 missing=0`
- Architecture-awareness refresh:
  - command: `node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar`
  - result: PASS
  - generated: `2026-06-05T10:58:31.707Z`
  - entities: `14282`
  - relations: `22292`
  - actionable missing docs: `72` -> `32`
  - actionable missing tests unchanged at `896`
- Architecture graph:
  - `pnpm run architecture:graph:generate` -> PASS (`651` nodes / `842` relations / `27` chains)
  - `pnpm run architecture:graph:drift:strict` -> PASS (`822/822`, `0` missing)
- Docs parity:
  - `pnpm run docs:parity:check` -> PASS (`API 22/22`, `Web 16/16`, `Routes 37/37`)
- Diff check:
  - targeted `git diff --check` -> PASS with LF/CRLF warnings only.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/status/architecture-awareness-report.md`
  - `docs/graphs/architecture-health.json`
  - `docs/architecture/relations/documentation-links.csv`
  - affected module docs listed in scope
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates:
  - Remaining actionable missing-doc rows now start with positions/profile/users/observability/prisma/queue/workers/Web shell surfaces and should be handled by follow-up owner lanes if the board wants full closure.

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert docs/relations changes if needed; no runtime rollback needed.
- Observability or alerting impact: none

## Result Report
- Task summary:
  - Classified `40` current actionable missing-doc backend route/helper targets across API root, auth, wallets, backtests, bots, engine, and orders.
  - Added direct scanner-readable doc links and owner-doc classification rows.
  - Reduced actionable missing docs from `72` to `32`.
- Files changed:
  - `docs/architecture/relations/documentation-links.csv`
  - `docs/modules/api-root.md`
  - `docs/modules/api-auth.md`
  - `docs/modules/api-wallets.md`
  - `docs/modules/api-backtests.md`
  - `docs/modules/api-bots.md`
  - `docs/modules/api-engine.md`
  - `docs/modules/api-orders.md`
  - generated architecture-awareness and graph/status exports
  - local state/task files
- How tested:
  - targeted CSV readback/duplicate check
  - architecture-awareness refresh
  - architecture graph generate
  - strict graph drift
  - docs parity
  - targeted diff check
- What is incomplete:
  - `32` actionable missing-doc rows remain after refresh, led by positions/profile/users/observability/prisma/queue/workers/Web shell surfaces.
- Next steps:
  - Create or assign follow-up owner lanes only if the board wants full remaining-doc closure beyond this issue.
- Decisions made:
  - Reused existing module docs and architecture reference docs instead of creating new docs.
  - Treated this as documentation/graph traceability only, not runtime proof or release readiness.
