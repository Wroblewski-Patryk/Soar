# Task

## Header
- ID: LUC-5298
- Title: Restore executable repair path for LUC-5146 protected-route redirect
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Technical Solution Architect
- Depends on: LUC-5146, LUC-5206
- Priority: P0
- Module Confidence Rows: Protected auth/session browser proof
- Requirement Rows: Auth/session invalid-token expired-session redirect
- Quality Scenario Rows: fail-closed auth/session behavior
- Risk Rows: stale protected proof blocks release acceptance
- Iteration: 2026-06-20
- Operation Mode: ARCHITECT
- Mission ID: LUC-5298-PROTECTED-ROUTE-REDIRECT-EXECUTABLE-PATH-2026-06-20
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the architecture/routing nature of this issue.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence row was identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: restore a live, evidence-backed path for the LUC-5146 protected-route invalid-token redirect blocker.
- Release objective advanced: unblock the auth/session portion of LUC-5206 from a stale proof failure.
- Included slices: inspect Web middleware/client auth surfaces, compare local tests with same-day production evidence, route remaining owner action.
- Explicit exclusions: no runtime patch, deploy, push, restart, env edit, secret readback, production account mutation, or protected smoke rerun.
- Checkpoint cadence: single heartbeat checkpoint.
- Stop conditions: active code defect found, auth semantics change required, or live owner path restored.
- Handoff expectation: QVE reconciles LUC-5146/LUC-5206 blocker state from latest PASS evidence.

## Context

LUC-5146 was created from LUC-5143 after a protected production browser proof
reported invalid-token redirect to `/auth/login` without `session=expired`.
LUC-5206 later reproduced that single failed step and blocked authenticated
acceptance on LUC-5146.

The latest same-day evidence changed the technical picture:

- `history/evidence/luc-5198-prod-auth-session-browser-proof-2026-06-20.md`
  passed invalid-token redirect with `path=/auth/login; search=?session=expired`.
- `history/evidence/luc-5250-prod-auth-session-browser-proof-2026-06-20.md`
  passed the same contract on the same production SHA.

## Goal

Decide whether LUC-5146 still needs a Web runtime repair or whether its parent
failure is stale, and leave a live owner/action so LUC-5206 is not blocked by a
paused Frontend assignment.

## Success Signal
- User or operator problem: release acceptance blocked by an apparently stale auth proof failure.
- Expected product or reliability outcome: protected invalid-token session semantics remain fail-closed and evidence-backed.
- How success will be observed: local focused tests pass and Paperclip has a live QVE reconciliation path.
- Post-launch learning needed: no.

## Deliverable For This Stage

Architecture/routing checkpoint with affected files, proof comparison, focused
validation, residual risk, and QA handoff.

## Constraints
- Use existing Web auth/session systems.
- Do not weaken auth boundaries.
- Do not make Web middleware validate JWTs; API `/auth/me` remains authoritative.
- Do not run protected production smoke without a fresh gate.

## Definition of Done
- [x] `apps/web/src/middleware.ts` inspected.
- [x] Focused Web auth/session tests run.
- [x] Same-day production evidence compared.
- [x] LUC-5146 has a live next owner/action through Paperclip.

## Forbidden
- Runtime workaround or duplicate auth path.
- Secret/cookie/token readback.
- Deploy, push, restart, env edit, production account mutation, exchange action, payment/subscription mutation, or live-trading action.

## Validation Evidence
- Tests: `pnpm --filter web test -- src/middleware.test.ts src/lib/api.test.ts src/context/AuthContext.test.tsx --run` passed, 3 files / 12 tests.
- Manual checks:
  - `apps/web/src/middleware.ts` preserves transport-level cookie presence gate.
  - `apps/web/src/lib/api.ts` redirects protected-route `401` responses to `/auth/login?session=expired`.
  - `apps/web/src/context/AuthContext.tsx` keeps expired-session warning semantics on protected or explicit expired-session contexts.
- Screenshots/logs: none.
- High-risk checks: fail-closed auth behavior preserved; no auth/session semantics changed.
- Module confidence ledger updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/pipelines/access-session.md`, `docs/architecture/traceability-matrix.md`, `apps/web/src/middleware.ts`, `apps/web/src/lib/api.ts`, `apps/web/src/context/AuthContext.tsx`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none; behavior did not change.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no runtime change.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: LUC-5146 remained assigned to paused Frontend while newer proof showed PASS.
- Gaps: LUC-5206 blocker state still referenced the older failing proof.
- Inconsistencies: LUC-5206 fail at `2026-06-20T16:40:24Z`; LUC-5198 pass at `2026-06-20T16:50:49Z`; LUC-5250 pass at `2026-06-20T18:24:31Z`.
- Architecture constraints: Web middleware stays transport-level only; API auth remains authoritative.

### 2. Select One Priority Mission Objective
- Selected task: reconcile protected-route invalid-token redirect path.
- Priority rationale: critical release acceptance blocker.
- Why other candidates were deferred: this heartbeat was scoped by Paperclip to LUC-5298.

### 3. Plan Implementation
- Files or surfaces to modify: source-of-truth evidence only.
- Logic: do not patch runtime unless current code/test evidence shows an active defect.
- Edge cases: stale production proof versus true intermittent redirect regression.

### 4. Execute Implementation
- Implementation notes: no runtime patch needed; created QA reconciliation path
  [LUC-5300](/LUC/issues/LUC-5300) in Paperclip.

### 5. Verify and Test
- Validation performed: focused Web auth/session tests and evidence comparison.
- Result: PASS locally; latest production evidence PASS.

### 6. Self-Review
- Simpler option considered: direct middleware patch.
- Technical debt introduced: no.
- Scalability assessment: keeps single source of auth truth in API/client flow.
- Refinements made: routed remaining work to QA rather than reopening a duplicate FE repair.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet, project state, task board, module confidence ledger.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report

- Task summary: LUC-5146's original failure is superseded by two later same-day PASS production proofs on the same SHA; the current Web auth/session implementation and focused tests preserve the intended `session=expired` contract.
- Files changed: docs/state/evidence only.
- How tested: `pnpm --filter web test -- src/middleware.test.ts src/lib/api.test.ts src/context/AuthContext.test.tsx --run`.
- What is incomplete: LUC-5206 still needs QVE reconciliation after LUC-5146 blocker status is updated.
- Next steps: [LUC-5300](/LUC/issues/LUC-5300) closes or supersedes LUC-5146 from latest PASS evidence and updates LUC-5206 blocker posture.
- Decisions made: `session=expired` remains the intended product/security proof expectation; no Security review is required because no auth/session behavior changed.
