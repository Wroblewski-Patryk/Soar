# Task

## Header
- ID: LUC-4939
- Title: [Soar] Regression evidence sweep
- Task Type: release
- Current Stage: verification
- Status: DONE_WITH_DELEGATED_REPAIR
- Owner: QA/Test
- Depends on: LUC-12
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001; Architecture Evidence Graph
- Iteration: 2026-06-20 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-4939-REGRESSION-EVIDENCE-SWEEP-2026-06-20
- Mission Status: PARTIALLY_VERIFIED

## Context
LUC-4939 is a recurring QA regression evidence loop for Soar V1 takeover. The
wake payload was `issue_assigned`, had no pending comments, and
`fallbackFetchNeeded=false`. Checkout was already claimed by the harness and
was not repeated.

The current repo state was already dirty from previous Soar state/evidence and
architecture exports before this sweep. This task did not revert, stage, commit,
push, deploy, restart, roll back, edit env, read secret values, mutate database
or Redis, use exchange credentials, place orders, mutate payment/subscription
state, or touch live-trading state.

## Goal
Refresh the safe regression/smoke evidence baseline and convert any failed
check into owned repair work.

## Scope
- Safe local QA smoke baseline through the existing repeatable runner.
- Documentation parity.
- Architecture graph drift and repository guardrails.
- Public production Web/API smoke with workers skipped.
- Paperclip repair routing for any failed evidence gate.

## Implementation Plan
1. Read Soar/Paperclip QA role context and current Soar state.
2. Run the smallest useful safe regression gates.
3. Inspect failures and identify exact repair owner/action.
4. Record evidence in Soar source-of-truth files.
5. Update Paperclip with final disposition.

## Acceptance Criteria
- Repeatable QA smoke evidence is current and persisted.
- Public API/Web smoke result is known.
- Docs parity result is known.
- Architecture/guardrail status is known.
- Failed checks have a one-owner follow-up issue or blocker.

## Definition of Done
- Validation commands and results are recorded.
- Residual risk is explicit.
- Repair work is delegated when outside QVE ownership.
- No protected or mutating production action occurred.

## Validation Evidence
- `pnpm softwarehouse:control-tick` -> BLOCKED BY ERROR: command not found in
  this checkout.
- `pnpm run -s docs:parity:check` -> PASS (`API 22/22`, `Web 16/16`,
  `Routes 39/39`).
- `pnpm run -s qa:smoke-e2e:repeatable -- --checks web,api,backtests --today 2026-06-20`
  -> PASS:
  - Web smoke pack PASS (`3` files / `18` tests).
  - API smoke pack PASS (`4` files / `45` tests).
  - Focused backtests e2e PASS (`1` file / `15` tests).
- `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  -> PASS:
  - API `/health` -> `200`.
  - API `/ready` -> `200`.
  - Web `/` -> `200`.
  - Web `/api/build-info` -> `200`.
- `pnpm run -s architecture:graph:drift:strict` -> FAIL:
  `847/849` covered, `2` missing.
- `pnpm run -s quality:guardrails` -> FAIL because the architecture graph drift
  guardrail failed with the same `847/849` coverage.

## Drift Finding
`docs/status/architecture-graph-drift.md` reports two missing graph CSV path
references:

- `apps/api/src/modules/subscriptions/payments/stripeWebhook.routes.ts`
- `apps/api/src/modules/subscriptions/payments/stripeWebhook.service.ts`

The failure is traceability/architecture evidence drift, not an observed public
runtime failure. It is outside the QA role's implementation ownership.

## Delegated Repair
Created [LUC-4945](/LUC/issues/LUC-4945), assigned to 09 TSA, to repair or
classify the two `stripeWebhook` architecture graph drift rows and rerun
`architecture:graph:drift:strict` plus `quality:guardrails`.

## Evidence Files
- `history/evidence/qa-repeatable-smoke-e2e-2026-06-20.md`
- `history/artifacts/qa-repeatable-smoke-e2e-2026-06-20.json`
- `docs/status/architecture-graph-drift.md`
- `history/artifacts/architecture-graph-drift-2026-05-24.json`

Note: the repeatable QA runner still writes `LUC-43` inside its generated
artifact body, but the file names, command invocation, and timestamp are the
fresh 2026-06-20 LUC-4939 sweep evidence.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-graph-drift.md`,
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes, existing graph relation mechanisms remain
  the repair path.
- Mismatch discovered: yes, missing graph path references.
- Decision required from user: no.
- Follow-up architecture doc updates: delegated to [LUC-4945](/LUC/issues/LUC-4945).

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: public Web/API smoke passed; worker/protected checks
  intentionally skipped.
- Rollback note: not applicable.

## Security / Privacy Evidence
- Data classification: public endpoints and local test output only.
- Secret handling: no secret values, cookies, tokens, account credentials, or
  response bodies were stored by this task.
- Fail-closed behavior: protected worker checks were not run; graph drift and
  guardrails failed closed.

## Result Report
- Task summary: refreshed safe regression evidence; local QA smoke and public
  smoke passed, docs parity passed, architecture drift/guardrails failed on two
  exact Stripe webhook graph path references.
- Files changed: generated evidence/artifact files and source-of-truth state
  updates for LUC-4939.
- How tested: commands listed above.
- What is incomplete: architecture graph drift remains unresolved until
  [LUC-4945](/LUC/issues/LUC-4945) closes.
- Next steps: 09 TSA executes [LUC-4945](/LUC/issues/LUC-4945).
- Decisions made: close LUC-4939 as a completed sweep with delegated repair,
  not as a protected production blocker.
