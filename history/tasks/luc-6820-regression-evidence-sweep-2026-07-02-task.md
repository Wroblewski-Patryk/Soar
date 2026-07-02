# LUC-6820 Regression Evidence Sweep - 2026-07-02

## Header
- ID: LUC-6820-REGRESSION-EVIDENCE-SWEEP-2026-07-02
- Title: Regression evidence sweep
- Task Type: verification
- Current Stage: verification
- Status: BLOCKED
- Owner: QA/Test
- Depends on: Docker Desktop local Linux engine availability; production Web
  restoration
- Priority: P1
- Module Confidence Rows: regression baseline; Web smoke pack; API DB-backed
  smoke; Backtests smoke; Architecture Evidence Graph; public production smoke
- Requirement Rows: regression baseline evidence; safe public smoke; repository
  guardrails
- Quality Scenario Rows: release regression confidence; local testability;
  architecture drift prevention
- Risk Rows: Docker unavailable; production Web 503
- Operation Mode: TESTER
- Mission ID: LUC-6820
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented in this task packet.
- [x] Exactly one priority task is selected: refresh regression evidence.
- [x] Operation mode is `TESTER`, matching the QA verification issue scope.
- [x] Existing QA runner and architecture/deploy smoke scripts were reused.
- [x] No product code, env, deploy, restart, account, exchange, payment, or
      live-trading mutation was performed.

## Mission Block
- Mission objective: refresh the safe regression/smoke evidence baseline for
  [LUC-6820](/LUC/issues/LUC-6820).
- Release objective advanced: V1 QA evidence freshness and blocker routing.
- Included slices: repeatable Web/API/backtests smoke runner, runner unit
  coverage, architecture graph drift, public production API/Web smoke, browser
  process cleanup check.
- Explicit exclusions: product fixes, deployment/restart, protected production
  smoke, secret/account readback, DB/Redis mutation, payment/exchange/order/
  position/subscription/live-trading actions.
- Stop conditions: first-class infrastructure or production availability
  blocker found.
- Handoff expectation: keep issue blocked with named unblock owner/action.

## Context
[LUC-6820](/LUC/issues/LUC-6820) asked QA to run or update the safe
regression/smoke evidence baseline during V1 takeover. The previous comparable
QA sweep, [LUC-6584](/LUC/issues/LUC-6584), was blocked by Web Vitest
timeouts, unavailable local Docker-backed API/backtests infrastructure, and
production Web `503`.

## Goal
Refresh the regression baseline or record first-class blockers with evidence.

## Success Signal
- User or operator problem: V1 release work needs fresh QA proof instead of
  stale smoke assumptions.
- Expected product or reliability outcome: current green checks and current
  blockers are separated clearly.
- How success will be observed: generated artifacts, command results, and
  source-of-truth state identify what passed and what remains blocked.
- Post-launch learning needed: no.

## Scope
- `scripts/runQaRepeatableSmokeE2e.mjs` execution only; no code edit.
- `scripts/runQaRepeatableSmokeE2e.test.mjs` execution only.
- `scripts/auditArchitectureGraphDrift.mjs` through package command.
- `scripts/deploySmokeCheck.mjs` public API/Web no-workers mode.
- Evidence/task/state files under `history/`, `.agents/state/`, and
  `.codex/context/`.

## Implementation Plan
1. Rerun the existing repeatable QA smoke runner for Web, API, and backtests.
2. Inspect generated JSON to classify failures.
3. Run the runner unit test pack to prove evidence tooling still works.
4. Run strict architecture drift to check graph coverage.
5. Run public deploy smoke without protected workers.
6. Check for leftover headless browser processes.
7. Update source-of-truth state and Paperclip disposition.

## Acceptance Criteria
- Repeatable smoke results are captured under `history/artifacts/` and
  `history/evidence/`.
- Any failed checks have a named concrete blocker and owner.
- Architecture drift status is refreshed.
- Public API/Web smoke status is refreshed.
- Browser/process cleanup evidence is recorded.

## Definition of Done
- [x] Regression commands were run or blockers were concretely recorded.
- [x] Evidence paths exist in `history/`.
- [x] Source-of-truth state files are updated.
- [x] Final disposition is evidence-backed and names the next owner/action.

## Forbidden
- Treating partial success as release acceptance.
- Creating workaround paths around failing checks.
- Creating commits from the existing dirty shared worktree.
- Deploying, pushing, restarting, rolling back, editing env, reading secret
  values, mutating production accounts, mutating exchange/payment state,
  placing orders, changing positions, mutating subscriptions, or live-trading.

## Validation Evidence
- `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests --artifact-prefix luc-6820-qa-repeatable-smoke-e2e --today 2026-07-02`
  - Result: FAIL.
  - Web smoke pack: PASS after `21838 ms`, `3` files / `18` tests.
  - API smoke pack: FAIL after `2985 ms`.
  - Focused backtests e2e: FAIL after `3857 ms`.
  - Blocker: Docker Desktop Linux engine pipe unavailable while starting
    `postgres` and `redis`; `docker compose up -d postgres redis` failed on
    `//./pipe/dockerDesktopLinuxEngine`.
  - Evidence:
    `history/artifacts/luc-6820-qa-repeatable-smoke-e2e-2026-07-02.json`;
    `history/evidence/luc-6820-qa-repeatable-smoke-e2e-2026-07-02.md`.
- `pnpm exec node --test scripts/runQaRepeatableSmokeE2e.test.mjs`
  - Result: PASS, `7/7`.
- `pnpm run architecture:graph:drift:strict`
  - Result: PASS, `850/850` covered, `0` missing.
- `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  - Result: FAIL.
  - API `/health` PASS `200`; API `/ready` PASS `200`.
  - Web `/` FAIL `503`; Web `/api/build-info` FAIL `503`.
- Cleanup:
  - `Get-Process chrome-headless-shell -ErrorAction SilentlyContinue` returned
    no rows.

## Architecture Evidence
- Architecture source reviewed: `.agents/core/project-memory-index.md` and
  existing architecture graph command contract through source-of-truth state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; strict drift passed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: public Web remains blocked at `503`; API health/ready
  remain green.
- Smoke steps updated: no.
- Rollback note: no rollback action taken; production restoration remains with
  the existing Ops path.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- [LUC-6584](/LUC/issues/LUC-6584) showed stale blockers from July 1.
- Current run shows Web local smoke improved to PASS; local DB-backed API and
  backtests remain blocked by Docker engine availability; production Web remains
  `503`.

### 2. Select One Priority Mission Objective
- Selected task: refresh [LUC-6820](/LUC/issues/LUC-6820) regression evidence.
- Other candidates deferred: product fixes and Ops restoration belong to
  specialist owner lanes.

### 3. Plan Implementation
- Reuse existing runner and smoke scripts; no implementation changes.

### 4. Execute Implementation
- Ran the repeatable smoke runner, runner tests, architecture drift, public
  deploy smoke, and cleanup check.

### 5. Verify and Test
- Results are recorded above and in generated artifacts.

### 6. Self-Review
- Existing systems were reused; no workaround, duplicate logic, or architecture
  changes were introduced.

### 7. Update Documentation and Knowledge
- Updated task/evidence/source-of-truth state for [LUC-6820](/LUC/issues/LUC-6820).
- Learning journal update: not applicable; Docker engine and production Web
  blockers are already known recurring release blockers.

## Result Report
- Task summary: [LUC-6820](/LUC/issues/LUC-6820) refreshed the regression
  evidence baseline and is blocked.
- Files changed: this task packet, generated QA evidence/artifact, and
  source-of-truth state entries.
- How tested: repeatable QA smoke, runner unit tests, architecture drift, public
  deploy smoke, browser-process cleanup check.
- What is incomplete: local API/backtests DB-backed smoke cannot run until the
  Docker Desktop Linux engine is available; public Web smoke cannot pass until
  production Web restoration completes.
- Next steps:
  - Ops/local runtime owner restores Docker Desktop Linux engine availability,
    then QVE reruns API/backtests repeatable smoke.
  - Ops Release Lead / board-approved Coolify mutation owner continues
    [LUC-6331](/LUC/issues/LUC-6331), then QVE reruns public Web and protected
    acceptance.
  - No duplicate repair child is warranted from this heartbeat.
- Decisions made: keep [LUC-6820](/LUC/issues/LUC-6820) `blocked` rather than
  `done` because two regression checks and public Web smoke remain blocked.
