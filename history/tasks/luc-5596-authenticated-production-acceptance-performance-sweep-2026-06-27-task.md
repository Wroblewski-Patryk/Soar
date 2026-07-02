# Task

## Header
- ID: LUC-5596
- Title: Authenticated Production Acceptance And Performance Sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: production `PROD_UI_AUDIT_*` secret references available
- Priority: P0
- Module Confidence Rows: production acceptance / auth session / dashboard-admin route reachability / runtime freshness
- Requirement Rows: production smoke, protected auth, runtime readiness, fail-closed session behavior
- Quality Scenario Rows: production responsiveness, reliability, secret-safe evidence
- Risk Rows: production auth, protected routes, worker readiness, rollback guard
- Iteration: 2026-06-27 heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5596-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-27
- Mission Status: VERIFIED

## Context
Recurring production QA sweep for Soar. The issue requires using stored
Paperclip secret references for production UI audit auth and testing read-only
user journeys, timing, worker freshness, frontend route behavior, backend
latency, and rollback posture together.

## Goal
Produce a current, secret-safe, read-only production acceptance and performance
evidence packet for [LUC-5596](/LUC/issues/LUC-5596).

## Scope
- Public/protected smoke.
- Production auth-session browser proof.
- Authenticated UI route/module clickthrough.
- Public and authenticated API timing samples.
- Runtime freshness and rollback guard.
- Evidence/state sync and Paperclip disposition.

Explicit exclusions:
deploy, push, restart, rollback execution, env edit, secret readback, DB/Redis
mutation, raw log capture, production account mutation, subscription/payment
mutation, exchange mutation, orders, positions, live-trading action, and
host-level VPS/proxy log capture.

## Implementation Plan
1. Read issue and role context.
2. Confirm production build-info SHA and worktree posture.
3. Run existing production proof scripts with secret values supplied only via
   environment.
4. Capture bounded timing artifact for canonical production endpoints.
5. Check browser process cleanup.
6. Write evidence and project state updates.
7. Close the Paperclip issue with source-control disposition.

## Acceptance Criteria
- Public API/Web and protected workers smoke pass.
- Auth-session browser proof passes.
- UI module clickthrough passes.
- Representative public/dashboard/admin API timing returns expected `200`
  statuses without persistent low-second or 60-second-class stalls.
- Runtime freshness passes.
- Rollback guard returns `shouldRollback=false`.
- No secret values or production payload bodies are stored.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` safety expectations observed for this
      verification-only task.
- [x] Production smoke passed.
- [x] Browser auth/session proof passed.
- [x] UI clickthrough passed.
- [x] Timing artifact captured.
- [x] Runtime freshness and rollback guard passed.
- [x] Evidence and source-of-truth state updated.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- production mutation or secret disclosure

## Validation Evidence
- `pnpm run -s ops:deploy:smoke`: PASS.
- `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb ...`: PASS.
- `pnpm run -s ops:ui:prod-clickthrough -- --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb ...`: PASS.
- Bounded production timing sampler:
  all final sampled endpoints returned expected `200` statuses.
- `pnpm run -s ops:deploy:runtime-freshness`: PASS.
- `pnpm run -s ops:deploy:rollback-guard`: PASS, `shouldRollback=false`.
- Browser cleanup:
  no remaining `chrome-headless-shell`, `chrome`, or `msedge` validation
  processes detected.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  existing production proof scripts and project AGENTS startup contract.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: positive production read-only proof.
- Smoke steps updated: no.
- Rollback note:
  rollback guard passed with `shouldRollback=false`; no rollback action
  executed.
- Observability or alerting impact:
  alerts readback returned empty through rollback guard.

## Autonomous Loop Evidence
1. Analyze current state:
   [LUC-5596](/LUC/issues/LUC-5596) requested authenticated production
   acceptance/performance; adjacent DRE evidence existed but did not replace
   this QA issue.
2. Select one priority mission objective:
   wake-scoped critical issue [LUC-5596](/LUC/issues/LUC-5596).
3. Plan implementation:
   use existing proof scripts and write evidence only.
4. Execute implementation:
   no product code changed; production proof commands ran read-only.
5. Verify and test:
   all listed checks passed.
6. Self-review:
   first timing sampler included two wrong representative endpoints that
   returned `404`; final artifact was replaced with canonical product API
   paths from existing DRE evidence.
7. Update documentation and knowledge:
   task, evidence, module confidence, system health, project state, task board,
   and active mission updated.

## Result Report
- Task summary:
  completed read-only authenticated production acceptance and performance sweep
  for deployed SHA `42177530f2a2ddc22832133b545bccab6ab404eb`.
- Files changed:
  evidence/task artifacts and source-of-truth state rows only.
- How tested:
  production smoke, browser proof, route clickthrough, timing sampler, runtime
  freshness, rollback guard.
- What is incomplete:
  host-level pressure/log-window capture and release-grade build provenance
  remain separate owner gates.
- Next steps:
  no [LUC-5596](/LUC/issues/LUC-5596) follow-up required unless a future deploy
  or production symptom appears.
- Decisions made:
  close as done; no repair child issue opened because no actionable failure was
  reproduced.
