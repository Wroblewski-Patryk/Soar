# Task

## Header
- ID: LUC-40
- Title: [Soar][Data] Persistence and integrity known-state
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: DB/Migrations
- Depends on: LUC-17, LUC-39
- Priority: P1
- Module Confidence Rows: SOAR-DATA-001, SOAR-OPERATIONS-001
- Requirement Rows: REQ-DATA-040
- Quality Scenario Rows: QAS-DATA-INTEGRITY-001
- Risk Rows: RISK-DATA-INTEGRITY-COVERAGE-2026-05-25, RISK-DATA-SECRET-HANDLING-2026-05-25, RISK-DATA-BACKUP-RESTORE-2026-05-25
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
Data-persistence lane checkpoint for issue `LUC-40` required an evidence-backed known-state across schema, migrations, and core persistence entities (users, sessions/auth-versioning, API keys, orders, positions, trades, runtime sessions, subscriptions, audit logs, consent-related fields).

## Goal
Publish a truthful persistence integrity snapshot with explicit verified/unknown areas and command evidence.

## Scope
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/*`
- `history/tasks/luc-40-data-persistence-known-state-2026-05-25-task.md`
- state sync docs (`.codex/context/*`, `.agents/state/*`)

## Implementation Plan
1. Inspect schema models, enums, relations, indexes, and ownership boundaries.
2. Verify migration chain health and schema validity with Prisma commands.
3. Record known-state with explicit evidence classes (`implemented and verified`, `implemented but not verified`, `present in code, behavior unknown`, `blocked by error`).
4. Sync canonical state docs.

## Acceptance Criteria
- Known-state artifact exists for `LUC-40` with evidence and exact commands.
- Core persistence surfaces are status-classified without optimistic claims.
- Migration/schema integrity has at least one direct verification pass.

## Definition of Done
- [x] Schema + migrations analyzed for Soar data-critical entities.
- [x] Prisma validation evidence captured.
- [x] Source-of-truth state files updated with current checkpoint and residual risk.

## Validation Evidence
- Tests:
  - `corepack pnpm --filter api run test -- src/modules/subscriptions src/modules/orders src/modules/positions src/modules/auth --run` -> blocked by error: command timeout after `124054ms` in this heartbeat.
- Manual checks:
  - `corepack pnpm --filter api exec prisma validate` -> PASS.
  - `corepack pnpm --filter api exec prisma migrate status --schema prisma/schema.prisma` -> PASS (`55 migrations found`, `Database schema is up to date`).
  - `corepack pnpm run ops:db:backup-restore:check-local` -> PASS (`history/operations/v1-db-restore-check-2026-05-25T18-02-43-687Z.md`).
- Screenshots/logs:
  - CLI output captured in heartbeat tool logs.
- Reality status: partially verified

## Known-State Outcome
- `implemented and verified`:
  - Prisma schema compiles/validates.
  - Migration chain is applied and current on local PostgreSQL (`cryptosparrow`, `localhost:5432`).
  - Local backup/restore replay for schema set `55` migrations passed with key-table readback (`User`, `Bot`, `Order`, `Position`, `Log`) and cleanup.
  - Core entities and ownership keys are present in schema: `User`, `ApiKey`, `UserSubscription`, `PaymentIntent`, `BotRuntimeSession`, `Position`, `Order`, `Trade`, `OrderFill`, `Log`, wallet cashflow/snapshot lineage.
- `implemented but not verified`:
  - End-to-end behavior under broad API packs for auth/orders/positions/subscriptions in this heartbeat (timed out before completion).
- `present in code, behavior unknown`:
  - Consent persistence is represented as `Bot.consentTextVersion` (field-level) rather than dedicated consent ledger model; no dedicated proof run in this heartbeat.
  - Secret-handling invariants for auth/session/versioned key paths remain unverified at persistence-mutation level in this lane and are explicitly routed.
- `blocked by error`:
  - Focused multi-module API test command exceeded timeout (`124054ms`).

## Data Integrity Notes
- Session invalidation persistence is implemented via `User.sessionVersion` (no separate session table), which matches current auth architecture but should remain explicitly documented as design choice.
- Several invariants rely on migration-level constraints not fully expressible in Prisma DSL (documented inline, e.g., partial unique indexes); these require migration replay checks in deeper audits.
- Secret-handling risk is routed to Security (secret redaction, rotation, ownership, and red-team scope) and Backend (migration replay / auth-key mutation contracts), with no schema changes in this lane.

## Result Report
- Task summary:
  - Published persistence known-state checkpoint for `LUC-40` with direct Prisma integrity evidence and explicit unknowns.
- Files changed:
  - `history/tasks/luc-40-data-persistence-known-state-2026-05-25-task.md`
  - canonical state docs (board/project/requirements/risk/ledger updates)
- How tested:
  - Prisma validate + migration status PASS; API focused pack timeout recorded.
- What is incomplete:
  - Focused API test completion for selected modules in this heartbeat.
- 2026-05-25: Added local backup/restore proof for `55` migrations, but DB-backed persistence behavior for auth/orders/positions/subscriptions remains partially verified due command timeout in focused API pack.
- Next steps:
  1. Re-run the timed-out API pack with narrower file slices and longer timeout.
  2. Add one DB-backed regression check per high-risk invariant (subscription entitlement, wallet/order/trade FK lifecycle, runtime session ownership).
  3. If consent-audit scope is required, introduce explicit requirement row for consent ledger strategy (field-level vs separate table).
  4. Coordinate Security + Backend follow-up for `RISK-DATA-SECRET-HANDLING-2026-05-25` and
     `RISK-DATA-BACKUP-RESTORE-2026-05-25` (already recorded in `risk-register`).
- Decisions made:
  - Kept this slice documentation/evidence-only; no schema or migration mutations without explicit defect trigger.
