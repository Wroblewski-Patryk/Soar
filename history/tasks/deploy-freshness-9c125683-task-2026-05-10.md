# DEPLOY-FRESHNESS-9C125683

## Header
- ID: `DEPLOY-FRESHNESS-9C125683-2026-05-10`
- Title: Verify live cancel boundary deployment freshness
- Task Type: release
- Current Stage: post-release
- Status: DONE
- Owner: Ops/Release
- Depends on:
  - `EXCHANGE2-31-LIVE-ORDER-CANCEL-BOUNDARY-2026-05-10`
- Priority: P0
- Iteration: 50
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches iteration 50 (`TESTER`).
- [x] The task is aligned with repository source-of-truth documents.

## Context
The live order cancel boundary commit was pushed as `b414e523`, but the first
production build-info wait ended with production still exposing the earlier
Gate.io live-submit SHA. A later pushed source-of-truth batch reached
`9c12568379ee77cda9c9e9df39879e141b5615fb`, which includes the live cancel
boundary and needs explicit deploy freshness evidence.

## Goal
Prove whether production currently exposes the batch containing
`EXCHANGE2-31-LIVE-ORDER-CANCEL-BOUNDARY-2026-05-10`, then refresh the V1
preflight truth without using protected credentials or real live-money actions.

## Success Signal
- User or operator problem: the user needs to know whether the latest pushed
  live cancel runtime is actually deployed before further V1 closure work.
- Expected product or reliability outcome: production freshness is separated
  from protected V1 evidence blockers.
- How success will be observed: build-info and public smoke pass for
  `9c12568379ee77cda9c9e9df39879e141b5615fb`; no-secret V1 preflight remains
  blocked only on protected/formal evidence.
- Post-launch learning needed: no

## Deliverable For This Stage
A release evidence artifact showing production freshness for `9c125683` and
the remaining V1 blockers.

## Scope
- `history/plans/deploy-freshness-9c125683-2026-05-10.md`
- `history/releases/v1-final-preflight-9c125683-2026-05-10.md`
- `history/artifacts/_artifacts-v1-final-preflight-9c125683-2026-05-10.json`
- active source-of-truth status files

## Implementation Plan
1. Wait for production Web build-info to expose the expected full SHA.
2. Run public deploy smoke against production API and Web.
3. Run the no-secret V1 final preflight for the same SHA.
4. Record deploy freshness and remaining blockers.
5. Sync active planning and state files.
6. Run repository guardrails, docs parity, and diff check.

## Acceptance Criteria
- Production Web build-info exposes
  `9c12568379ee77cda9c9e9df39879e141b5615fb`.
- Public API `/health`, API `/ready`, and Web `/` smoke checks pass.
- V1 final preflight output is stored and clearly marked blocked on protected
  or formal evidence only.
- The old `b414e523` deploy-lag artifact is superseded by this freshness
  artifact.

## Definition of Done
- [x] Build-info freshness evidence is recorded.
- [x] Public deploy smoke evidence is recorded.
- [x] No-secret V1 preflight artifact is recorded.
- [x] Source-of-truth files are updated.
- [x] Repository validations pass.

## Forbidden
- Do not use live exchange credentials.
- Do not perform live-money submit or cancel actions.
- Do not mark V1 complete without protected production evidence.
- Do not hide stale or missing RC, rollback, restore, or liveimport evidence.

## Validation Evidence
- Tests:
  - PASS: `node scripts\repoGuardrails.mjs`.
  - PASS: `node scripts\checkDocsParity.mjs`.
  - PASS: `git diff --check`.
- Manual checks:
  - PASS: `node scripts\waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha 9c12568379ee77cda9c9e9df39879e141b5615fb --timeout-seconds 600 --interval-seconds 30`.
  - PASS: `node scripts\deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`.
  - BLOCKED as expected: `node scripts\runV1FinalPreflight.mjs --expected-sha 9c12568379ee77cda9c9e9df39879e141b5615fb --today 2026-05-10 --json-output history/artifacts/_artifacts-v1-final-preflight-9c125683-2026-05-10.json --markdown-output history/releases/v1-final-preflight-9c125683-2026-05-10.md`.
- Screenshots/logs: not applicable.
- High-risk checks: no protected credentials or live exchange actions were
  used.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/exchange-access-ownership-matrix.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: not applicable.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: runtime rollback remains the normal Coolify rollback to a
  previous image; this task changes evidence docs only.
- Observability or alerting impact: none.
- Staged rollout or feature flag: existing exact exchange capability gates.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: active docs still recorded a deploy lag for the live cancel boundary.
- Gaps: production freshness for the current pushed batch was not recorded.
- Inconsistencies: public service health passed while build-info freshness was
  stale in source-of-truth files.
- Architecture constraints: no live-money or protected action can be inferred
  from public smoke.

### 2. Select One Priority Task
- Selected task: verify and record deploy freshness for `9c125683`.
- Priority rationale: V1 status cannot be honestly summarized while active
  docs still say the latest runtime is not production-proven.
- Why other candidates were deferred: protected preflight and UI clickthrough
  require operator credentials not present in this shell.

### 3. Plan Implementation
- Files or surfaces to modify: release evidence docs, active task board,
  project state, system health, current focus, next steps, and MVP queue.
- Logic: public deploy evidence only; protected blockers remain explicit.
- Edge cases: a passing public smoke must not be treated as V1 completion.

### 4. Execute Implementation
- Implementation notes: production already exposed `9c125683` on the
  follow-up wait; public smoke passed; preflight artifacts were generated.

### 5. Verify and Test
- Validation performed: build-info wait, public smoke, no-secret preflight,
  guardrails, docs parity, and diff check.
- Result: public freshness PASS; protected V1 completion BLOCKED.

### 6. Self-Review
- Simpler option considered: only updating the deploy-lag file.
- Technical debt introduced: no.
- Scalability assessment: release evidence follows existing deploy-freshness
  artifact pattern.
- Refinements made: separated deploy freshness from protected V1 blockers.

### 7. Update Documentation and Knowledge
- Docs updated: deploy freshness artifact, deploy lag artifact, EXCHANGE2-31
  task result, active state and planning files.
- Context updated: project state and task board.
- Learning journal updated: not applicable.

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

## Result Report

- Task summary: production now exposes the pushed batch containing live order
  cancel boundary support.
- Files changed: release evidence docs, active state/context/planning docs.
- How tested: build-info wait, public deploy smoke, no-secret V1 preflight,
  guardrails, docs parity, and diff check.
- What is incomplete: protected liveimport, rollback guard, production DB
  restore context, RC sign-off/checklists, backup/restore drill, and
  authenticated/admin UI clickthrough remain blocked or stale.
- Next steps: refresh protected/formal V1 release evidence when operator
  credentials and DB restore context are available.
- Decisions made: production freshness is complete for this batch, but V1 is
  not complete.
