# Task

## Header
- ID: LIVE-RUNTIME-SAFETY-READINESS-DIAGNOSTICS-2026-05-10
- Title: Expose protected LIVE no-order guard diagnostics in readiness details
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: LIVE-RUNTIME-KILL-SWITCH-CONFIG-2026-05-10
- Priority: P0
- Iteration: 2026-05-10-continue-live-proof-preflight
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number or defaults to BUILDER when
  the active queue has no explicit numeric iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Controlled LIVE session proof now has env-controlled no-order guards, but the
operator still needs a protected production readback proving the running API
process sees those flags before any LIVE bot activation.

## Goal
Expose non-secret LIVE no-order guard state through the existing protected
`/ready/details` diagnostics endpoint.

## Scope
- `apps/api/src/router/index.ts`
- `apps/api/src/router/health-readiness.test.ts`
- `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- `docs/operations/bot-module-operator-runbook.md`
- `.agents/state/*`
- `.codex/context/*`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Reuse `readRuntimeSignalLoopConfig()` inside `/ready/details`.
2. Add a `runtimeSafety.liveNoOrderGuard` object with boolean flag states and
   derived `active`.
3. Keep `/ready` public output unchanged.
4. Cover protected diagnostics and public non-disclosure with API tests.
5. Update operator and architecture docs plus state files.

## Acceptance Criteria
- Protected `/ready/details` includes no-order guard booleans and derived
  active state.
- Public `/ready` does not expose runtime safety details.
- The diagnostics contain no secrets or credential values.
- Focused API tests and typecheck pass.

## Definition of Done
- [x] Code and tests are implemented.
- [x] Architecture and ops docs are updated.
- [x] Source-of-truth state files are updated.
- [x] Relevant validation passes.
- [x] Result report records residual risk and next task.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Do not expose secrets or raw env values.
- Do not change public `/ready` response shape.
- Do not activate LIVE bots or submit orders in this task.
- Do not create a parallel readiness system.

## Validation Evidence
- Tests:
  - `apps/api`: `vitest run src/router/health-readiness.test.ts` initially
    failed before assertions because `DATABASE_URL` was missing from the test
    process.
  - `apps/api`: PowerShell-loaded `DATABASE_URL` from `.env` then
    `vitest run src/router/health-readiness.test.ts` PASS (`10/10`).
  - `apps/api`: `tsc --noEmit` PASS.
- Manual checks: pending
- Screenshots/logs: pending
- High-risk checks: no live activation or exchange write attempted; public
  `/ready` remains minimal.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/09_integrations-deployment-and-runtime-services.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: health/readiness diagnostic note.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none in code; diagnostics only read existing flags.
- Health-check impact: public `/ready` unchanged; protected `/ready/details`
  gains non-secret runtime safety diagnostics.
- Smoke steps updated: controlled LIVE proof runbook will require checking
  `/ready/details` first.
- Rollback note: revert this commit if readiness detail response regresses.
- Observability or alerting impact: improves operator observability.
- Staged rollout or feature flag: existing kill-switch env flags.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: controlled LIVE proof needs confirmation that the running API process
  sees the kill-switch env flags.
- Gaps: no protected readiness field exposes these flags today.
- Inconsistencies: runbook can tell operators to set flags, but cannot prove
  the runtime process observed them.
- Architecture constraints: reuse existing health/readiness surfaces and avoid
  public secret/config disclosure.

### 2. Select One Priority Task
- Selected task: protected readiness diagnostics for LIVE no-order guards.
- Priority rationale: safer prerequisite before any production LIVE activation.
- Why other candidates were deferred: actual LIVE bot activation remains
  money-impacting and should happen only after diagnostics are deployed.

### 3. Plan Implementation
- Files or surfaces to modify: API router, tests, architecture/ops docs, state.
- Logic: derive booleans from typed runtime config and expose only booleans plus
  `active`.
- Edge cases: `/ready/details` must include diagnostics even when readiness is
  `not_ready`; public `/ready` must remain minimal.

### 4. Execute Implementation
- Implementation notes: reused the existing protected `/ready/details`
  endpoint, added dynamic typed runtime-config readback, and exposed only
  non-secret booleans plus derived `active`.

### 5. Verify and Test
- Validation performed: focused readiness tests and API typecheck.
- Result: PASS after explicitly loading local `DATABASE_URL` for the DB-backed
  readiness tests.

### 6. Self-Review
- Simpler option considered: rely on Coolify UI only. Rejected because process
  restart/env-read truth must be observable through the app.
- Technical debt introduced: no
- Scalability assessment: uses existing readiness detail endpoint.
- Refinements made: added a public `/ready` non-disclosure assertion and raw
  env-name non-disclosure assertions for the protected response.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/operations/bot-module-operator-runbook.md`
  - `.agents/state/*`
  - `.codex/context/*`
  - `docs/planning/mvp-next-commits.md`
- Context updated: yes
- Learning journal updated: yes

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This task does not perform the controlled LIVE session proof. It only adds the
protected runtime-safety preflight signal needed before that proof.

## Result Report
Protected `/ready/details` now reports the LIVE no-order guard state under
`runtimeSafety.liveNoOrderGuard`, including `globalKillSwitch`,
`emergencyStop`, and derived `active`. Public `/ready` remains minimal. This
closes the pre-activation observability gap for controlled LIVE session proof;
the next task is deployment, then setting Coolify flags and verifying
`active=true` before any LIVE bot activation.
