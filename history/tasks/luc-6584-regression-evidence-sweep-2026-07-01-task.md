# LUC-6584 Regression Evidence Sweep - 2026-07-01

## Header
- ID: LUC-6584-REGRESSION-EVIDENCE-SWEEP-2026-07-01
- Title: Regression evidence sweep
- Task Type: verification
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: Web smoke timeout triage; Docker Desktop local engine
  availability; production Web restoration
- Priority: P1
- Module Confidence Rows: regression baseline; Web smoke pack; API DB-backed
  smoke; Backtests smoke; Architecture Evidence Graph; public production smoke
- Requirement Rows: regression baseline evidence; safe public smoke; repository
  guardrails
- Quality Scenario Rows: release regression confidence; local testability;
  architecture drift prevention
- Risk Rows: Web smoke timeout; Docker unavailable; production Web 503;
  guardrails timeout
- Operation Mode: TESTER
- Mission ID: LUC-6584
- Mission Status: BLOCKED

## Context
[LUC-6584](/LUC/issues/LUC-6584) requested a QA regression evidence sweep. The
latest comparable sweep, [LUC-6413](/LUC/issues/LUC-6413), was blocked by Web
Vitest timeouts, unavailable local Docker-backed API/backtests infrastructure,
and production Web `503`.

## Goal
Refresh the regression baseline or record first-class blockers with evidence.

## Constraints
- Use the smallest sufficient verification packet.
- Do not deploy, push, restart, roll back, edit env, read secret values, mutate
  production accounts, mutate exchange/payment state, place orders, change
  positions, mutate subscriptions, or perform live-trading actions.
- Do not modify product code from this QA heartbeat.

## Definition Of Done
- Regression commands are run or blockers are concretely recorded.
- Evidence paths exist in `history/`.
- Source-of-truth state files are updated.
- Final disposition is evidence-backed and names the next owner/action.

## Forbidden
- Treating partial success as release acceptance.
- Creating workaround paths around the failing checks.
- Creating commits from the existing dirty shared worktree.

## Validation Evidence
- `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests --artifact-prefix luc-6584-qa-repeatable-smoke-e2e --today 2026-07-01`
  - Result: FAIL.
  - Web smoke pack: FAIL after `160564 ms`.
  - API smoke pack: FAIL after `12288 ms`.
  - Focused backtests e2e: FAIL after `9197 ms`.
  - Evidence:
    `history/artifacts/luc-6584-qa-repeatable-smoke-e2e-2026-07-01.json`;
    `history/evidence/luc-6584-qa-repeatable-smoke-e2e-2026-07-01.md`.
- `pnpm exec node --test scripts/runQaRepeatableSmokeE2e.test.mjs`
  - Result: PASS, `7/7`.
- `pnpm run architecture:graph:drift:strict`
  - Result: PASS, `850/850` covered, `0` missing.
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - Result: FAIL.
  - API `/health` PASS `200`; API `/ready` PASS `200`.
  - Web `/` FAIL `503`; Web `/api/build-info` FAIL `503`.
- `pnpm run quality:guardrails`
  - Result: TIMEOUT after `180s`.
- Cleanup:
  - `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` returned no rows.

## Result Report
- Task summary: LUC-6584 refreshed the regression evidence baseline and remains
  blocked.
- Files changed: LUC-6584 evidence/task records and source-of-truth state
  entries only.
- What is incomplete: repeatable Web/API/backtests smoke baseline is not green;
  public Web smoke is not green; guardrails did not return before timeout.
- Next steps:
  - TAE/FEW triages the two Web Vitest timeout failures.
  - Ops/DRE restores Docker Desktop local engine, then QVE reruns API/backtests
    repeatable smoke.
  - Ops/Coolify owner resolves [LUC-6331](/LUC/issues/LUC-6331), then QVE
    reruns public Web smoke and authenticated acceptance.
- Control-plane caveat:
  Paperclip `PATCH /api/issues/LUC-6584` to `blocked` timed out after `20s`;
  `/api/health` and heartbeat-context readbacks also timed out after `8s`.
  The intended remote disposition is `blocked` using this task/evidence packet.
