# Task

## Header
- ID: LUC-2308
- Title: Deploy fixed `soar-web` runtime wrapper from `a70d7881`
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: [LUC-2304](/LUC/issues/LUC-2304)
- Priority: P0
- Module Confidence Rows: Web production runtime/deploy proof
- Requirement Rows: production Web public readiness
- Quality Scenario Rows: deployment recovery, public smoke
- Risk Rows: production Web 503 / missing runtime wrapper
- Iteration: 2026-06-05 Ops heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2308-SOAR-WEB-FIXED-WRAPPER-DEPLOY
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence, risk, and operations state were identified.
- [x] The task improves release confidence with public production evidence.

## Context
[LUC-2304](/LUC/issues/LUC-2304) fixed the Web runtime image packaging fault
where production `soar-web` could not find
`scripts/runWebNextProductionCommand.mjs`. [LUC-2308](/LUC/issues/LUC-2308)
authorized Ops to recover only the `soar-web` production application from
`a70d7881b69e605c537af5f81cbeb74dc81e9329` and verify public Web readiness.

## Goal
Verify that production `soar-web` serves the fixed wrapper build at
`a70d7881b69e605c537af5f81cbeb74dc81e9329` while API health remains green.

## Scope
- Production Web: `https://soar.luckysparrow.ch/`
- Production Web build-info: `https://soar.luckysparrow.ch/api/build-info`
- Production API health/readiness: `https://api.soar.luckysparrow.ch`
- Coolify resource: `Soar / production / soar-web`
- Local evidence: `history/evidence/luc-2308-soar-web-fixed-wrapper-deploy-verification-2026-06-05.md`

## Implementation Plan
1. Confirm local and remote source refs for `main`.
2. Read Coolify `soar-web` state without exposing secrets.
3. Avoid extra production mutation if the target SHA is already live.
4. Run public no-workers Web/API smoke for the expected SHA.
5. Record evidence and close the Paperclip issue.

## Acceptance Criteria
- `origin/main` is `a70d7881b69e605c537af5f81cbeb74dc81e9329`.
- Web `/` returns `200`.
- Web `/api/build-info` returns `200` and reports the expected SHA.
- API `/health` remains `200`.
- No mutation outside `soar-web`; no secrets printed.

## Definition of Done
- [x] Source-ref gate recorded.
- [x] Public Web/API smoke passed.
- [x] Evidence artifact written.
- [x] System health updated.
- [x] Issue closed with verification and residual risk.

## Forbidden
- API, worker, PostgreSQL, Redis, env var, secret, account, exchange, or
  live-trading mutation.
- More than one deploy/restart/rollback.
- Secret value disclosure.

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha a70d7881b69e605c537af5f81cbeb74dc81e9329 --no-workers` -> PASS.
- Manual checks:
  - `git ls-remote origin refs/heads/main` -> expected SHA.
  - `curl.exe` status probe -> Web `/` `200`, Web `/api/build-info` `200`, API `/health` `200`.
  - Direct build-info JSON -> expected full `gitSha`.
- Screenshots/logs: not applicable.
- High-risk checks: secret values were not printed; no production mutation was executed after the target SHA was already live.
- Module confidence ledger updated: no, narrow Ops recovery evidence recorded in system health.
- Reality status: verified.

## Deployment / Ops Evidence
- Deploy impact: medium, production Web recovery.
- Env or secret changes: none.
- Health-check impact: Web public route and build-info recovered; API health/readiness stayed green.
- Smoke steps updated: no.
- Rollback note: previous `soar-web` rollback path remains the existing Coolify source/image rollback procedure; not used.
- Observability or alerting impact: no new alerting changes.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue permit reviewed from Paperclip heartbeat context.
- Prior [LUC-2305](/LUC/issues/LUC-2305) evidence showed Web crash root cause as missing runtime wrapper.

### 2. Select One Priority Mission Objective
- Selected [LUC-2308](/LUC/issues/LUC-2308), the assigned critical Ops deploy verification issue.

### 3. Plan Implementation
- Use read-only source/Coolify checks, then one permitted deploy only if needed.
- If production already serves the expected SHA, avoid redundant mutation and verify instead.

### 4. Execute Implementation
- Confirmed `origin/main` matches `a70d7881b69e605c537af5f81cbeb74dc81e9329`.
- Read Coolify `soar-web` state.
- No manual deploy was triggered because production already served the target SHA.

### 5. Verify and Test
- Public no-workers smoke passed for API health/readiness, Web root, and Web build-info expected SHA.

### 6. Self-Review
- Avoiding a redundant redeploy is safer than mutating a production service that is already serving the target fixed source.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: evidence artifact and system health.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Current stage is declared and respected.
- [x] Existing systems were reused.
- [x] No workaround path introduced.
- [x] No logic duplication introduced.
- [x] Relevant validation ran.
- [x] Source-of-truth evidence updated.

## Result Report

- Task summary: verified production `soar-web` recovered and is serving fixed source `a70d7881b69e605c537af5f81cbeb74dc81e9329`.
- Files changed:
  - `history/evidence/luc-2308-soar-web-fixed-wrapper-deploy-verification-2026-06-05.md`
  - `history/tasks/luc-2308-deploy-fixed-soar-web-runtime-wrapper-from-a70d7881-2026-06-05-task.md`
  - `.agents/state/system-health.md`
- How tested: public deploy smoke and direct build-info/status probes.
- What is incomplete: broader protected auth/dashboard/worker smoke is outside this narrow permit.
- Next steps: release coordinator/QA can run broader post-deploy smoke if required for V1 release gates.
- Decisions made: skipped redundant manual deploy because the target SHA was already live and verified.
