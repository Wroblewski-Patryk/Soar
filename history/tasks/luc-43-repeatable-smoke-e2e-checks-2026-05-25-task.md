# Task

## Header
- ID: LUC-43-REPEATABLE-SMOKE-E2E-CHECKS-2026-05-25
- Title: [Soar][Test Automation] Repeatable smoke and e2e checks
- Task Type: feature
- Current Stage: verification
- Status: IN_PROGRESS
- Owner: QA/Test
- Depends on: LUC-18-QA-REGRESSION-SMOKE-BASELINE-2026-05-25
- Priority: P0
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: CHECKPOINTED

## Context
LUC-18 established baseline QA commands but lacked a single repeatable command with durable artifacts that other agents can run and compare across heartbeats.

## Goal
Provide one repeatable smoke/e2e runner for `web`, `api`, and focused `backtests` checks with deterministic pass/fail and stored evidence.

## Constraints
- Reuse existing smoke/e2e commands.
- No production mutation.
- Keep scope in QA automation lane only.

## Definition of Done
- [x] New repeatable command exists in root scripts.
- [x] Runner writes JSON + Markdown evidence artifacts.
- [x] Focused local proof run executed and recorded.

## Forbidden
- redefining product acceptance
- hiding failing checks without explicit evidence
- adding temporary bypasses

## Validation Evidence
- Tests: `pnpm run qa:smoke-e2e:repeatable -- --checks web` (PASS)
- Manual checks: artifact files created and readable
- Screenshots/logs: `history/artifacts/qa-repeatable-smoke-e2e-2026-05-25.json`
- Reality status: partially verified

## Result Report
- implemented and verified:
  - `scripts/runQaRepeatableSmokeE2e.mjs`
  - `pnpm run qa:smoke-e2e:repeatable`
  - focused run for `web` with generated artifacts
- implemented but not verified:
  - full `web,api,backtests` run on this heartbeat
- residual risk:
  - known `backtests.e2e` failures are expected to remain until fix lane delivers repair
