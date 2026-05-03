# Task

## Header

- ID: RUNTIME-AUDIT-88
- Title: fix(api-positions): scope reconciliation owner cleanup by market
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-87
- Priority: P0
- Iteration: 88
- Operation Mode: BUILDER

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context

Operator-reported LIVE/PAPER dashboard drift remains under audit after the
market-scoped LIVE import work. `RUNTIME-AUDIT-87` narrowed stale synced
position scans by reconciled market type, but the same reconciliation pass still
seeds owner cleanup candidates from every ownership-index key under the same API
key prefix.

## Goal

Ensure LIVE reconciliation cleanup for open synced orders and local managed
positions considers only owners from the reconciled market type plus legacy
unscoped ownership keys, excluding other canonical market prefixes on the same
API key.

## Success Signal

- User or operator problem: LIVE dashboard and exchange truth can drift when one
  API key has SPOT and FUTURES assignments.
- Expected product or reliability outcome: reconciliation for one market cannot
  clean up positions/orders owned only by another market.
- How success will be observed: focused regression proves cross-market owner
  keys are ignored during owner cleanup seeding.
- Post-launch learning needed: no

## Deliverable For This Stage

Implemented and verified the market-scoped owner cleanup filter in the existing
LIVE position reconciliation path.

## Constraints

- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope

- `apps/api/src/modules/positions/livePositionReconciliation.helpers.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan

1. Add a small helper that classifies ownership-index keys as current-market or
   legacy-unscoped for a given API key.
2. Use that helper when seeding `ownedOwnersByKey` in LIVE reconciliation.
3. Add a regression where a FUTURES reconciliation ignores a SPOT owner on the
   same API key during owner cleanup.
4. Run focused reconciliation tests, API typecheck, guardrails, lint, and diff
   review.
5. Sync task, board, project state, and MVP planning evidence.

## Acceptance Criteria

- FUTURES reconciliation includes FUTURES ownership keys.
- FUTURES reconciliation preserves legacy unscoped ownership keys.
- FUTURES reconciliation excludes SPOT ownership keys for owner cleanup.
- Existing LIVE reconciliation behavior remains covered and green.

## Definition of Done

- [x] `DEFINITION_OF_DONE.md` is satisfied for this small runtime slice.
- [x] Focused regression covers cross-market owner cleanup exclusion.
- [x] Relevant validation commands pass.
- [x] Context and planning docs are updated with evidence.

## Stage Exit Criteria

- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden

- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence

- Tests: `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --run` => PASS (`30/30`); `pnpm --filter api run typecheck` => PASS; `pnpm run quality:guardrails` => PASS; `pnpm run lint` => PASS; `git diff --check` => PASS.
- Manual checks: diff review completed.
- Screenshots/logs: not applicable
- High-risk checks: fail-closed cross-market ownership cleanup regression

## Architecture Evidence

- Architecture source reviewed: `docs/architecture/01_overview-and-principles.md`,
  `docs/architecture/architecture-source-of-truth.md`,
  `docs/modules/system-modules.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not expected

## Deployment / Ops Evidence

- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous owner cleanup scope
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: `ownedOwnersByKey` was seeded by broad `apiKeyId:` prefix.
- Gaps: no regression proved cross-market owner keys are ignored during cleanup.
- Inconsistencies: stale synced position scan was market-scoped, owner cleanup
  seeding was not.
- Architecture constraints: LIVE exchange truth must be scoped by configured bot
  market groups and API-key market type.

### 2. Select One Priority Task

- Selected task: scope reconciliation owner cleanup seeding by market.
- Priority rationale: owner cleanup can affect LIVE orders and positions.
- Why other candidates were deferred: broader dashboard audits continue after
  this single high-impact reconciliation drift is closed.

### 3. Plan Implementation

- Files or surfaces to modify: helper, reconciliation service, focused tests,
  planning/context docs.
- Logic: accept current canonical `apiKeyId:marketType:` keys and legacy
  `apiKeyId:symbol` keys; reject other canonical market prefixes.
- Edge cases: missing market type keeps FUTURES legacy behavior; legacy
  unscoped ownership remains supported.

### 4. Execute Implementation

- Implementation notes: added `isImportedExternalPositionKeyInMarketScope` and
  used it when seeding `ownedOwnersByKey`.

### 5. Verify and Test

- Validation performed: focused reconciliation suite, API typecheck,
  repository guardrails, lint, and diff whitespace check.
- Result: PASS.

### 6. Self-Review

- Simpler option considered: inline predicate in service only.
- Technical debt introduced: no
- Scalability assessment: helper keeps market-key semantics reusable and small.
- Refinements made: avoided broad formatter churn and kept the service under
  the production monolith budget.

### 7. Update Documentation and Knowledge

- Docs updated: this task, MVP next commits, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
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

This is a runtime safety slice for same-API-key SPOT/FUTURES separation.

## Production-Grade Required Contract

- Goal: prevent cross-market owner cleanup drift in LIVE reconciliation.
- Scope: helper, reconciliation service, focused tests, source-of-truth docs.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: see above and `DEFINITION_OF_DONE.md`.
- Result Report: completed below.

## Integration Evidence

## Product / Discovery Evidence

- Problem validated: yes
- User or operator affected: LIVE bot operator
- Existing workaround or pain: manual dashboard/exchange comparison
- Smallest useful slice: owner cleanup seed filtering
- Success metric or signal: regression test plus reconciliation suite pass
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: normal reconciliation logs/dashboard

## Reliability / Observability Evidence

- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: LIVE position/order reconciliation
- SLI: reconciliation correctness
- SLO: no known cross-market cleanup drift
- Error budget posture: not applicable
- Health/readiness check: unchanged
- Logs, dashboard, or alert route: existing reconciliation warnings
- Smoke command or manual smoke: focused automated regression
- Rollback or disable path: revert commit

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: automated service-level test
- Regression check performed: focused reconciliation regression

## AI Testing Evidence

Not applicable.

## Security / Privacy Evidence

- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: trading/account metadata
- Trust boundaries: authenticated user exchange API-key scope
- Permission or ownership checks: owner cleanup restricted to reconciled market
- Abuse cases: cross-market same-api-key ownership collision
- Secret handling: no secret changes
- Security tests or scans: typecheck/lint/guardrails
- Fail-closed behavior: other-market owner is ignored
- Residual risk: production authenticated smoke remains credential-dependent

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report

- Task summary: LIVE reconciliation owner cleanup now filters
  ownership-index keys by the reconciled market type while preserving legacy
  unscoped keys.
- Files changed:
  `apps/api/src/modules/positions/livePositionReconciliation.helpers.ts`,
  `apps/api/src/modules/positions/livePositionReconciliation.service.ts`,
  `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`,
  and planning/context docs.
- How tested: focused reconciliation suite (`30/30`), API typecheck,
  guardrails, lint, and diff check.
- What is incomplete: authenticated production dashboard smoke remains
  credential-dependent and was not claimed in this slice.
- Next steps: continue auditing remaining LIVE/PAPER dashboard-runtime drifts.
- Decisions made: legacy unscoped ownership keys remain accepted for backward
  compatibility; other canonical market prefixes are excluded.
