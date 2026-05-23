# Task

## Header
- ID: AUD07-ISOLATED-DB-RUNNER-2026-05-19
- Title: Add canonical isolated DB-backed audit runner
- Task Type: tooling
- Current Stage: verification
- Status: DONE
- Owner: QA/Backend
- Depends on: DATA-MODEL-MIGRATIONS-AUDIT-2026-05-19
- Priority: P1
- Module Confidence Rows: no runtime product status changes
- Requirement Rows: REQ-DATA-007
- Quality Scenario Rows: not changed
- Risk Rows: RISK-032
- Iteration: 2026-05-19 AUD-07 isolation mitigation
- Operation Mode: BUILDER
- Mission ID: AUD07-ISOLATED-DB-RUNNER-2026-05-19
- Mission Status: VERIFIED

## Process Self-Audit
- [x] The task targeted a repairable audit-process finding, not product scope.
- [x] No production database or existing production data was touched.
- [x] No LIVE order/cancel/close or exchange-side mutation was run.
- [x] Local infra was stopped after DB-backed validation.
- [x] Source-of-truth state was updated after proof.

## Mission Block
- Mission objective: mitigate the `AUD-07` shared-DB parallel e2e finding with
  a canonical sequential reset-and-run command.
- Release objective advanced: future data audits have one safe command instead
  of relying on chat memory.
- Included slices: script, package command, testing docs, audit state sync,
  local proof.
- Explicit exclusions: production migration proof, production backup/restore,
  broad DB-backed suite refactor, isolated-schema test harness.
- Checkpoint cadence: implement runner, list packs, run full local proof, stop
  infra, update state.
- Stop conditions: local infra cannot start, runner fails, or cleanup fails.
- Handoff expectation: use `pnpm run audit:data:db-isolated` for representative
  `AUD-07` DB-backed checks.

## Context
`AUD-07` recorded that combining DB-backed e2e files against one shared local
database can create false failures from cleanup/FK interference.

## Goal
Provide and prove a command that validates representative DB-backed packs
sequentially with a clean migrated database before each pack.

## Constraints
- Keep repository artifacts in English.
- Reuse existing tests.
- Do not change application runtime behavior.
- Do not hide that parallel shared-DB execution remains unsafe.

## Definition of Done
- [x] Runner exists and is callable through `package.json`.
- [x] Runner resets DB before each representative pack.
- [x] Full local runner proof passes.
- [x] Local infra cleanup is verified.
- [x] Audit/state docs are synchronized.

## Forbidden
- Production DB mutation.
- LIVE trading mutation.
- Exchange-side mutation.
- Treating this runner as production migration freshness proof.

## Validation Evidence
- `corepack pnpm run audit:data:db-isolated -- --list` PASS:
  wallets, backtests, runtime-repository packs listed.
- `corepack pnpm run go-live:infra:up` PASS.
- `corepack pnpm run audit:data:db-isolated` PASS:
  - Prisma schema validation PASS.
  - Prisma migration status PASS.
  - Reset before wallets, wallets `24/24` PASS.
  - Reset before backtests, backtests `15/15` PASS.
  - Reset before runtime repository, runtime repository `2/2` PASS.
- `corepack pnpm run go-live:infra:down` PASS.

## Result Report
- Result: `AUD-07` shared-DB parallel finding is mitigated by a canonical
  runner.
- Files changed: `scripts/runAud07IsolatedDbPacks.mjs`, `package.json`,
  `docs/engineering/testing.md`, and audit/state docs.
- Deployment impact: none.
- Residual risk: production migration/backup/restore freshness remains under
  `AUD-19`; broad DB e2e packs still need isolated databases/schemas if run in
  parallel.
