# Task

## Header
- ID: LUC-194
- Title: [Soar] Regression evidence sweep
- Task Type: verification
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: none
- Priority: P1

## Context
Assigned heartbeat required a concrete QA regression-evidence checkpoint for
Soar with durable artifacts and source-of-truth sync.

## Goal
Run the smallest meaningful repeatable regression sweep and publish fresh
evidence for current Web/API/backtests smoke health.

## Constraints
- QA lane only (no feature implementation).
- No deploy/runtime mutation.
- No secret values in artifacts.

## Definition of Done
- [x] Repeatable regression sweep command executed.
- [x] Fresh machine-readable artifact produced.
- [x] Fresh evidence markdown produced.
- [x] Source-of-truth state files updated with outcome.
- [x] Final lane disposition recorded.

## Validation Evidence
- `pnpm run qa:smoke-e2e:repeatable -- --checks web,api` -> `PASS`
  - Web smoke pack: `PASS`
  - API smoke pack: `PASS`
  - Artifact: `history/artifacts/qa-repeatable-smoke-e2e-2026-05-26.json`
  - Evidence: `history/evidence/qa-repeatable-smoke-e2e-2026-05-26.md`
- `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests` -> `PASS`
  - Web smoke pack: `PASS`
  - API smoke pack: `PASS`
  - Focused backtests e2e: `PASS`
  - Artifact: `history/artifacts/qa-repeatable-smoke-e2e-2026-05-26.json`
  - Evidence: `history/evidence/qa-repeatable-smoke-e2e-2026-05-26.md`

## Result Report
- Completed a bounded regression evidence sweep in QA lane with no runtime or
  deploy mutation.
- Current local regression baseline for selected packs is green (`web`, `api`,
  `backtests`)
  and reproducible from one command.
- Residual risk: this checkpoint does not include protected auth production
  routes or live-trading flows.

## Deploy Impact
- `none` (verification-only heartbeat).

## Final Disposition
`done`
