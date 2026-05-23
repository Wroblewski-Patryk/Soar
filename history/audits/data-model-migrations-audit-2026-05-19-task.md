# DATA-MODEL-MIGRATIONS-AUDIT-2026-05-19

Stage: verification
Status: DONE
Audit ID: `AUD-07`

## Context

The reusable audit registry marks Data Model And Migrations as a partial lane.
This task refreshes schema validity, migration replay, critical data invariants,
and representative DB-backed data contracts against the current repository.

## Goal

Produce a reusable `AUD-07` audit artifact that truthfully records what the
current code and local database migration path prove, and what remains outside
the proof.

## Scope

- Prisma schema and migration chain.
- Critical uniqueness/index invariants for market data, positions, bot market
  groups, runtime dedupe, wallets/capital, subscriptions, and logs.
- Local DB-backed representative wallet, backtest, and runtime repository
  contract tests.
- Test isolation behavior for DB-backed packs.

## Implementation Plan

1. Validate Prisma schema.
2. Start local Postgres/Redis.
3. Check migration status and replay all migrations locally.
4. Inspect schema/migration invariants.
5. Run representative DB-backed data-contract tests.
6. Record audit artifacts and state updates.
7. Stop local infrastructure and run cleanup checks.

## Acceptance Criteria

- `prisma validate` passes.
- Local `prisma migrate status` reports the schema up to date.
- Local `prisma migrate reset --force --skip-seed` applies all migrations.
- Representative DB-backed tests pass in isolated reset-and-run mode.
- Any DB isolation or production-freshness gaps are recorded without optimistic
  wording.

## Definition Of Done

- Audit Markdown and JSON artifacts exist.
- Baseline, module confidence, requirements, risks, project state, task board,
  next steps, system health, and memory index are updated.
- Local infra is stopped before closure.
- No production mutation or LIVE/exchange-side mutation is performed.

## Forbidden

- Do not mutate production data.
- Do not run LIVE order/cancel/close or exchange-side mutation.
- Do not claim production migration readiness from local replay alone.
- Do not hide failed DB-backed parallel execution; record it as an audit
  finding.

## Result Report

Completed 2026-05-19. Local schema validation passed, local migration status
reported `54` migrations and an up-to-date schema, full local migration replay
applied all `54` migrations, and isolated wallet/backtest/runtime data-contract
tests passed (`24`, `15`, and `2` tests respectively). A P1 test isolation
finding remains: DB-backed e2e packs are not safe to run in parallel on one
shared local database without reset or isolation. Follow-up added
`pnpm run audit:data:db-isolated`, a canonical runner that resets the local
database before each representative DB-backed pack. Full follow-up proof passed
with local infra: wallets `24/24`, backtests `15/15`, runtime repository `2/2`.
