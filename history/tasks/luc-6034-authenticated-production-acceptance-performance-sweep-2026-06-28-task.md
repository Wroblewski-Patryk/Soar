# Task

## Header
- ID: LUC-6034
- Title: Authenticated production acceptance and performance sweep
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: production audit login environment mapping
- Priority: P0
- Module Confidence Rows: production smoke / auth session / dashboard and admin route clickthrough / worker readiness / runtime freshness
- Requirement Rows: production authenticated acceptance, protected fail-closed behavior, performance smoke
- Quality Scenario Rows: production reliability, auth boundary, performance, rollback safety
- Risk Rows: stale smoke token residual, release provenance residual, host-level proof residual
- Iteration: 2026-06-28 Paperclip heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-6034-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-28
- Mission Status: VERIFIED

## Context
Where this work sits in the current project flow and architecture.

[LUC-6034](/LUC/issues/LUC-6034) is a recurring critical QVE production acceptance and performance sweep. A process-lost retry left issue-specific browser/session and route-clickthrough artifacts but not the aggregate issue disposition.

## Goal
Produce a complete read-only production acceptance packet for [LUC-6034](/LUC/issues/LUC-6034), reusing recovered issue artifacts and filling the missing smoke/runtime/performance evidence.

## Scope
- Production API: `https://api.soar.luckysparrow.ch`
- Production Web: `https://soar.luckysparrow.ch`
- Deployed SHA: `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`
- Evidence files:
  - `history/evidence/luc-6034-authenticated-production-acceptance-performance-sweep-2026-06-28.md`
  - `history/artifacts/luc-6034-production-performance-timing-2026-06-28.json`
  - recovered `history/evidence/luc-6034-prod-auth-session-browser-proof-retry-2026-06-28.md`
  - recovered `history/evidence/luc-6034-prod-ui-module-clickthrough-2026-06-28.md`

## Implementation Plan
1. Read scoped Paperclip context and QVE role contract.
2. Inspect prior QVE evidence and recovered [LUC-6034](/LUC/issues/LUC-6034) artifacts.
3. Run read-only deploy smoke through audit login mapping.
4. Run stale-token fail-closed smoke without audit mapping.
5. Run runtime freshness and rollback guard.
6. Run representative timing sample.
7. Write aggregate evidence and state updates.
8. Update Paperclip issue to `done`.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within read-only verification
- never print or store secret values, cookies, tokens, or protected response bodies

## Acceptance Criteria
- Production public smoke passes.
- Protected `/workers/ready` passes through approved audit login mapping.
- Stale/default protected path fails closed with `401`.
- Auth-session browser proof passes without storing secrets/cookies/tokens.
- Dashboard/admin route clickthrough passes.
- Runtime freshness passes and rollback guard does not recommend rollback.
- Representative timing sample passes.
- Residual risks and source-control disposition are explicit.

## Definition of Done
- [x] Read-only production validation completed.
- [x] Evidence files created or recovered and linked.
- [x] Source-of-truth state files updated.
- [x] No protected mutation occurred.
- [x] Paperclip issue disposition set to `done`.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- deploy, push, restart, rollback execution, env edit, account mutation, subscription/payment mutation, exchange mutation, order, position, or live-trading action

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3bd65e21d09f294a18d3317d2f59f7a0d4e577b4` with audit login mapping: PASS.
  - same smoke without audit login mapping: FAIL-CLOSED on `/workers/ready -> 401`; public/build-info rows PASS.
  - `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch --timeout-ms 12000`: PASS.
  - `pnpm run ops:deploy:rollback-guard -- --base-url https://api.soar.luckysparrow.ch --timeout-ms 12000`: PASS, `shouldRollback=false`.
- Manual checks:
  - Timing sample: PASS, public rows `200`, unauth protected rows expected `401`.
- Screenshots/logs:
  - no screenshots captured in this heartbeat; recovered browser artifacts store route/status summaries only.
- High-risk checks:
  - no secrets, cookies, protected response bodies, exchange settings, billing/subscription state, live-trading state, or production data mutations were written or changed.
- Module confidence ledger updated: yes.
- Requirements matrix updated: no, recurring proof only.
- Quality scenarios updated: no, recurring proof only.
- Risk register updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: issue context, production evidence, existing runtime smoke scripts.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: positive verification only.
- Smoke steps updated: no.
- Rollback note: rollback guard returned `shouldRollback=false`.
- Observability or alerting impact: no alert mutation; rollback guard alerts `[]`.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: scoped [LUC-6034](/LUC/issues/LUC-6034) process-lost retry with recovered partial artifacts.
- Gaps: aggregate evidence, timing artifact, task contract, issue disposition.
- Inconsistencies: stale `SMOKE_AUTH_TOKEN` still fails protected smoke with `401`.
- Architecture constraints: read-only production QA lane only.

### 2. Select One Priority Mission Objective
- Selected task: close [LUC-6034](/LUC/issues/LUC-6034) production acceptance proof.
- Priority rationale: critical routine issue with process-lost retry.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: history evidence/artifact/task files and state ledgers.
- Logic: no product logic changes.
- Edge cases: stale token fail-closed path and no secret leakage.

### 4. Execute Implementation
- Implementation notes: reused recovered issue artifacts and ran missing production checks.

### 5. Verify and Test
- Validation performed: deploy smoke, stale-token smoke, runtime freshness, rollback guard, timing sample.
- Result: PASS for acceptance; stale-token path fail-closed as expected.

### 6. Self-Review
- Simpler option considered: closing from recovered artifacts only.
- Technical debt introduced: no.
- Scalability assessment: recurring sweep can continue using existing scripts.
- Refinements made: added aggregate evidence to avoid leaving orphaned recovered artifacts.

### 7. Update Documentation and Knowledge
- Docs updated: evidence/task/state files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report

- Task summary: completed read-only authenticated production acceptance and performance sweep for [LUC-6034](/LUC/issues/LUC-6034).
- Files changed: evidence/task/artifact/state docs only.
- How tested: deploy smoke, stale-token smoke, runtime freshness, rollback guard, timing sample; recovered browser/session and route clickthrough artifacts reviewed.
- What is incomplete: stale `SMOKE_AUTH_TOKEN`, release-grade build provenance, and host-level VPS/log-window proof remain separate owner paths.
- Next steps: no further work on [LUC-6034](/LUC/issues/LUC-6034); separate Security/Ops/release lanes own residuals.
- Decisions made: close as verified production acceptance because all QVE-owned checks passed and residuals are already outside this lane.

