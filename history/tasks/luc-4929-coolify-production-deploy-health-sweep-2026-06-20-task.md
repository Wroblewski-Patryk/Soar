# Task

## Header
- ID: LUC-4929
- Title: Coolify production deploy health sweep
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: [LUC-4811](/LUC/issues/LUC-4811)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production deploy health
- Requirement Rows: not changed
- Quality Scenario Rows: Reliability / production health and deploy diagnosis
- Risk Rows: production deploy observability incomplete
- Iteration: 2026-06-20 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-4929-COOLIFY-PROD-DEPLOY-HEALTH-SWEEP-2026-06-20
- Mission Status: PARTIALLY_VERIFIED

## Context
[LUC-4929](/LUC/issues/LUC-4929) asked DRE to check Coolify/VPS deploy status,
Soar project/environment/resources, source commit, health endpoints, logs,
rollback readiness, and post-deploy smoke evidence without exposing
credentials. The issue also recorded fresh board/user observations that recent
Coolify deploys failed and required deploy diagnosis to stay separate from any
redeploy/restart/protected-smoke approval.

## Goal
Run the smallest read-only production health sweep available from this runner,
record what is verified, and fail closed on Coolify/VPS deploy diagnosis where
approved read-only bindings are absent.

## Scope
- Public Web/API health and timing.
- Web `/api/build-info` source commit/provenance readback.
- Release-grade Web build-info wait gate.
- Protected auth/session browser proof through pre-bound audit account names.
- Names-only binding scan and local Coolify env-check contract.
- Paperclip issue disposition with first-class blocker path.

## Implementation Plan
1. Read Paperclip heartbeat context and Soar ops state.
2. Run public production smoke without workers.
3. Read Web build-info and run the release provenance wait gate.
4. Run protected browser auth/session proof without storing secrets, cookies,
   tokens, or response bodies.
5. Run public timing samples.
6. Run names-only binding scan and Coolify env-check tests.
7. Clean validation browser process/profile artifacts.
8. Update evidence, task, source-of-truth state, and issue disposition.

## Acceptance Criteria
- Public health endpoints are checked and results are recorded.
- Current Web source commit and metadata source are recorded.
- Protected browser proof either passes or reports a fail-closed blocker.
- Coolify/VPS diagnosis either runs or is blocked with named owner/action.
- No production mutation, secret readback, or raw log exposure occurs.

## Definition of Done
- [x] Read-only checks completed where bindings allowed them.
- [x] Evidence artifact created.
- [x] Source-of-truth state updated.
- [x] Paperclip issue updated to terminal/blocked disposition with blocker.

## Forbidden
- Deploy, push, restart, rollback, or environment edits.
- Secret/account value readback.
- Database/Redis mutation.
- Raw Coolify/VPS log capture without approved redaction path.
- Production account, exchange, payment, subscription, or live-trading mutation.

## Validation Evidence
- Tests:
  - `pnpm run -s ops:coolify-stack:env-check:test` passed (`11/11`).
- Manual checks:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` passed.
  - `node scripts/waitForWebBuildInfo.mjs --build-info-url https://soar.luckysparrow.ch/api/build-info --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --timeout-seconds 1 --interval-seconds 1 --request-timeout-ms 10000` failed closed on `unaccepted metadataSource=env-runtime`.
  - `pnpm run -s ops:prod-auth:proof -- --i-understand-production-auth-proof --expected-sha 42177530f2a2ddc22832133b545bccab6ab404eb --output-json history/evidence/_artifacts-luc-4929-prod-auth-session-browser-proof-2026-06-20.json --output-md history/evidence/luc-4929-prod-auth-session-browser-proof-2026-06-20.md` passed.
  - `pnpm run -s ops:coolify-stack:env-check` failed closed with required present `0/16`, reporting names only.
- Screenshots/logs: none captured.
- High-risk checks:
  - No secret/cookie/token/body artifact storage.
  - No browser process rows remained after proof.
  - This heartbeat's `.tmp/prod-auth-cdp-1781940698096` directory was removed.
- Module confidence ledger updated: yes.
- Reality status: partially verified / blocked.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: rollback remains the documented Coolify/manual operator path; no rollback was triggered.
- Observability or alerting impact: deploy observability remains incomplete until read-only bindings are injected.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue context confirmed fresh failed-Coolify-deploy observations and required diagnosis without mutation.
- Prior Soar state showed app health verified but Coolify/VPS binding readback blocked.

### 2. Select One Priority Mission Objective
- Selected [LUC-4929](/LUC/issues/LUC-4929) because the scoped wake assigned it as critical.

### 3. Plan Implementation
- Use existing smoke, build-info, auth proof, env-check, and source-of-truth evidence mechanisms.

### 4. Execute Implementation
- Ran public smoke, build-info readback, provenance wait gate, protected auth proof, timing samples, binding scan, and env-check tests.

### 5. Verify and Test
- App-level checks passed.
- Provenance gate failed closed as designed.
- Coolify/VPS diagnosis blocked because binding families are absent.

### 6. Self-Review
- Existing systems were reused.
- No workaround, duplicate checker, or production mutation was introduced.

### 7. Update Documentation and Knowledge
- Updated task/evidence, system health, module confidence ledger, active mission, next steps, task board, and project state.

## Review Checklist
- [x] Architecture alignment confirmed.
- [x] Existing systems reused.
- [x] No workaround paths introduced.
- [x] No logic duplication introduced.
- [x] Relevant validations run.
- [x] Docs/context updated.

## Result Report
- Task summary: production app health and protected auth session are verified;
  Web build-info release provenance and Coolify/VPS deploy diagnosis remain
  blocked.
- Files changed: this task/evidence file plus source-of-truth state updates and
  generated protected proof artifacts.
- How tested: public smoke, build-info gate, protected auth proof, timing
  samples, env-check test.
- What is incomplete: Coolify deployment rows/logs/resource/VPS health and
  release-grade Web provenance.
- Next steps: [LUC-4811](/LUC/issues/LUC-4811) must inject approved read-only
  Coolify/VPS status bindings into the DRE runtime; after that, rerun this
  read-only deploy health sweep.
- Decisions made: no redeploy, restart, rollback, protected worker smoke, or
  secret readback is authorized by this sweep.
