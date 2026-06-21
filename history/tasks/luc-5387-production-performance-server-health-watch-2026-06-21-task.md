# Task

## Header
- ID: LUC-5387
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production performance and server health
- Requirement Rows: production smoke/readiness evidence
- Quality Scenario Rows: availability, latency, reliability, observability
- Risk Rows: production latency tails, Coolify status fidelity, build provenance
- Iteration: 2026-06-21 DRE heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-5387-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-21
- Mission Status: PARTIALLY_VERIFIED

## Context
LUC-5387 is a recurring DRE routine for Soar production performance and server
health. Recent predecessor evidence showed intermittent API/Web latency tails,
Coolify application rows reporting `running:unknown`, healthy DB/Redis, and
diagnostic-only Web build provenance.

## Goal
Produce the smallest sufficient current production-health proof and close or
escalate based on evidence.

## Constraints
- Use existing smoke/clickthrough/Coolify mechanisms.
- Stay read-only.
- Do not deploy, push, restart, rollback, edit env, mutate DB/Redis, mutate
  production accounts, read back secrets, capture raw logs, or perform trading
  or payment actions.
- Do not create duplicate repair issues without fresh narrow evidence.

## Definition of Done
- [x] Public and protected production smoke run and classified.
- [x] Current performance timing window captured.
- [x] Coolify/DB/Redis read-only projection captured without secrets.
- [x] Authenticated dashboard/admin route reachability checked.
- [x] Evidence and project state updated.
- [x] Issue updated to final disposition.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- production mutation without explicit approval

## Validation Evidence
- Tests:
  - `pnpm run -s ops:coolify-stack:env-check:test` PASS (`11/11`).
- Manual checks:
  - `pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`: public PASS; first protected token path `401`; rerun with token suppressed PASS including `/workers/ready`.
  - `curl.exe` phase timing: API `/health` 20/20 `200`, max `1515.0 ms`, avg `281.1 ms`, two samples over `1000 ms`; API `/ready` 10/10 `200`, max `196.7 ms`; Web `/` 10/10 `200`, max `257.7 ms`.
  - `node scripts/runProdUiModuleClickthroughAudit.mjs ...`: PASS; public `4/4`, dashboard `18/18`, admin `3/3`, legacy redirects `3/3`.
  - Read-only Coolify GET projection PASS for version, team, project, environments, production environment, resources, and deployments.
- Screenshots/logs: no screenshots or raw logs captured.
- High-risk checks: no deploy, restart, env edit, DB/Redis mutation, secret readback, production account mutation, or live-trading action.
- Module confidence ledger updated: yes
- Reality status: partially verified

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: no code/config change
- Smoke steps updated: no
- Rollback note: rollback not indicated; rollback-guard-specific auth vars were not present for this heartbeat.
- Observability or alerting impact: no code/config change

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: recurring API `/health` latency tails; Coolify application rows remain `running:unknown`; Web build-info still `env-runtime`.
- Gaps: no same-window host/proxy/container pressure or sanitized log-window evidence in this heartbeat.
- Architecture constraints: read-only DRE watch; no deploy/restart/env mutation.

### 2. Select One Priority Mission Objective
- Selected task: LUC-5387 production performance and server health watch.
- Priority rationale: critical routine assigned in wake payload.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state docs only.
- Logic: run existing smoke/check scripts and classify signals.
- Edge cases: stale token path, secret redaction, dirty worktree, Coolify app status fidelity.

### 4. Execute Implementation
- Implementation notes: no runtime code changed.

### 5. Verify and Test
- Validation performed: smoke, clickthrough, timing, Coolify projection, checker test.
- Result: partially verified healthy; API `/health` TLS/start-transfer tails remain watch item.

### 6. Self-Review
- Simpler option considered: public smoke only.
- Technical debt introduced: no
- Scalability assessment: routine remains lightweight; deeper host/proxy correlation should only run on stronger recurrence.
- Refinements made: reran protected smoke through fresh login path after stale token `401`.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence, system health, module confidence, task board, project state.
- Context updated: yes.
- Learning journal updated: not applicable.

## Source-Control Closure
- Files changed: evidence/task/state docs only.
- Verification commands and results: listed above.
- Commit SHA: not committed; shared worktree was already dirty with unrelated work and this routine produced evidence/state only.
- Push status: not needed.
- Deploy impact: none.
- Residual risk: API `/health` TLS/start-transfer tails; Coolify app rows `running:unknown`; Web build-info `env-runtime`.
- Next owner: DRE/Ops only if fresh recurrence requires same-window host/proxy/container and sanitized log-window capture; LUC-4912 remains owner for build provenance.

