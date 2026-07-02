# LUC-6584 Regression Evidence Sweep (2026-07-01)

## Scope
- Read-only QA regression evidence sweep for [LUC-6584](/LUC/issues/LUC-6584).
- No deploy, push, restart, rollback, env edit, secret/account readback,
  production account mutation, exchange/payment mutation, order, position,
  subscription mutation, or live-trading action occurred.

## Result
- Disposition: `BLOCKED / REGRESSION_BASELINE_FAIL`.
- Repeatable Web/API/backtests smoke is not green.
- Architecture graph drift is clean.
- Repeatable smoke runner unit tests pass.
- Public no-workers production smoke still shows API healthy and Web `503`.

## Command Evidence
| Check | Result | Evidence |
| --- | --- | --- |
| `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests --artifact-prefix luc-6584-qa-repeatable-smoke-e2e --today 2026-07-01` | FAIL | `history/evidence/luc-6584-qa-repeatable-smoke-e2e-2026-07-01.md`; `history/artifacts/luc-6584-qa-repeatable-smoke-e2e-2026-07-01.json` |
| `pnpm exec node --test scripts/runQaRepeatableSmokeE2e.test.mjs` | PASS | `7/7` tests passed |
| `pnpm run architecture:graph:drift:strict` | PASS | `850/850` covered, `0` missing |
| `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` | FAIL | API `/health` and `/ready` `200`; Web `/` and `/api/build-info` `503` |
| `pnpm run quality:guardrails` | TIMEOUT | command exceeded `180s` runner timeout before returning a final result |
| `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` | PASS | no rows returned |

## Failure Notes
- Web smoke pack failed after `160564 ms`.
  - `BotsManagement.test.tsx` monitoring-tab test timed out at `5000 ms`.
  - `Header.responsive.test.tsx` navigation-landmark test timed out at
    `5000 ms`.
- API smoke pack failed before assertions because Docker Desktop Linux engine
  was unavailable while resolving `postgres:15`.
- Focused backtests e2e failed before assertions for the same Docker Desktop
  Linux engine pipe error.
- Public production smoke cannot pass while Web root and build-info return
  `503`.

## Next Owner / Action
- TAE/FEW triages the two Web Vitest timeout failures or proves the timeouts
  are harness budget issues with a deterministic bounded rerun.
- Ops/DRE restores local Docker Desktop Linux engine before QVE can rerun
  DB-backed API/backtests smoke.
- Ops Release Lead / board-approved Coolify mutation owner resolves
  [LUC-6331](/LUC/issues/LUC-6331), then QVE reruns public Web smoke and
  authenticated acceptance.

## Paperclip Control Plane
- Intended issue disposition: `blocked`.
- `PATCH /api/issues/LUC-6584` timed out after `20s`.
- Follow-up `/api/health` and
  `/api/issues/LUC-6584/heartbeat-context` readbacks timed out after `8s`.
- Local evidence and state files are the durable handoff until the control
  plane accepts the blocked disposition.
