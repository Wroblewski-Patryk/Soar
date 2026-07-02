# LUC-5650 Production Performance And Server Health Watch

## Header

- ID: LUC-5650
- Title: Production performance and server health watch
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release / 09 DRE (Deployment & Reliability Engineer)
- Depends on: none
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production performance and server-health
- Requirement Rows: operational post-deploy smoke and runtime readiness
- Quality Scenario Rows: reliability, performance, observability
- Risk Rows: production latency, stale protected smoke token, limited host-level pressure evidence
- Iteration: 2026-06-27 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-5650-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-27
- Mission Status: VERIFIED

## Process Self-Audit

- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the assigned DRE watch lane.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block

- Mission objective: run a read-only production performance and server-health watch for Soar.
- Release objective advanced: verify production remains reachable, responsive, worker-ready, and not rollback-worthy.
- Included slices: public smoke/timing, protected workers readiness, dashboard/admin API timing, runtime freshness, rollback guard, Coolify projection, source-control/process posture.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit, secret/account readback, DB/Redis mutation, raw log capture, production account mutation, subscription/payment mutation, exchange action, order, position, live-trading action.
- Checkpoint cadence: single heartbeat verification packet.
- Stop conditions: active outage, rollback trigger, missing credentials that block all protected proof, or production mutation requirement.
- Handoff expectation: close if healthy; create one narrow incident only if regression or unknown bottleneck remains actionable.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active DRE chat | Wake payload, issue context | Integration, task closure, source-of-truth updates | Evidence and issue disposition | Paperclip update | DONE |
| Ops/Runtime | DRE | post-deploy smoke checklist, system-health | Production API/Web, workers, Coolify projection | Read-only health summary | Smoke/timing/freshness/rollback/Coolify checks | DONE |
| Security | Existing guardrails | credentials contract | Secret handling boundary | No secret values stored | binding names only | DONE |
| Documentation/Memory | DRE | project state ledgers | history, task board, system health, module confidence | Durable evidence | file updates | DONE |

## Context

[LUC-5650](/LUC/issues/LUC-5650) is a recurring production-performance and server-health watch. The issue description requires a read-only app/runtime/Coolify health loop and exactly one narrow incident only if a real regression appears.

## Goal

Confirm whether Soar production is technically up and commercially responsive, with special attention to prior operator concern about 60-second-class dashboard stalls.

## Scope

Run current read-only smoke, timing, runtime, rollback, and Coolify projection checks. Update evidence and project state. Do not mutate production.

## Implementation Plan

1. Read issue context and relevant DRE/project instructions.
2. Run public and protected smoke with stale-token and fresh-login paths.
3. Run runtime freshness and rollback guard.
4. Capture public and authenticated API timing.
5. Capture read-only Coolify projection.
6. Update evidence, task packet, and project state.
7. Post final Paperclip disposition.

## Acceptance Criteria

- Public API/Web smoke and timing captured.
- Protected workers readiness tested through stale-token and fresh-login paths.
- Representative authenticated dashboard/admin API timing captured when safe credentials exist.
- Runtime freshness and rollback guard captured.
- Coolify read-only projection captured without secret values.
- Evidence and project state updated.
- Issue disposition posted.

## Definition of Done

- [x] Public API/Web smoke and timing captured.
- [x] Protected workers readiness tested through stale-token and fresh-login paths.
- [x] Representative authenticated dashboard/admin API timing captured.
- [x] Runtime freshness and rollback guard captured.
- [x] Coolify read-only projection captured without secret values.
- [x] Evidence and project state updated.
- [x] Issue disposition posted.

## Forbidden

- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- deploy, push, restart, rollback execution, env edit, secret/account readback, DB/Redis mutation, raw log capture, production account mutation, subscription/payment mutation, exchange action, order, position, or live-trading action

## Validation Evidence

- Tests:
  - `node --test scripts/checkCoolifyStackEnv.test.mjs` PASS (`11/11`)
- Manual checks:
  - deploy smoke public PASS; stale-token `/workers/ready` `401`
  - fresh-login deploy smoke PASS including `/workers/ready`
  - public timing all `200:8`
  - authenticated dashboard/admin API timing all `200:3`
  - `/dashboard/markets/catalog` cold sample normalized on follow-up `200:8`, max `105.0 ms`
  - runtime freshness PASS
  - rollback guard PASS, `shouldRollback=false`
  - read-only Coolify projection PASS, zero visible deployment rows
- Screenshots/logs:
  - no screenshots; no raw logs captured
- High-risk checks:
  - no secret values, tokens, raw resource IDs, cookies, payload bodies, or production data stored
- Module confidence ledger updated: yes
- Reality status: verified

## Architecture Evidence

- Architecture source reviewed: post-deploy smoke checklist and production operations state
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence

- Deploy impact: none
- Env or secret changes: none
- Health-check impact: no implementation change
- Smoke steps updated: no
- Rollback note: guard returned `shouldRollback=false`
- Observability or alerting impact: no implementation change; host-level pressure/log-window proof remains limited by missing read-only host credentials
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State

- Issues: production watch was actionable and critical.
- Gaps: host-level VPS pressure/log-window capture unavailable without approved host-status credentials.
- Inconsistencies: pre-bound `SMOKE_AUTH_TOKEN` still fails protected workers readiness.
- Architecture constraints: read-only verification only.

### 2. Select One Priority Mission Objective

- Selected task: [LUC-5650](/LUC/issues/LUC-5650) production performance and server-health watch.
- Priority rationale: critical recurring DRE production reliability check.
- Why other candidates were deferred: wake payload scoped this heartbeat to [LUC-5650](/LUC/issues/LUC-5650).

### 3. Plan Implementation

- Files or surfaces to modify: history evidence/task files and project state ledgers only.
- Logic: run existing read-only probes and summarize results.
- Edge cases: stale token path, host credential absence, dirty mixed worktree.

### 4. Execute Implementation

- Implementation notes: no code implementation; verification and evidence only.

### 5. Verify and Test

- Validation performed: smoke, timing, authenticated API timing, runtime freshness, rollback guard, Coolify env test, Coolify projection.
- Result: production healthy enough for routine closure, with stale smoke token and one normalized market-catalog cold sample retained as watch residuals.

### 6. Self-Review

- Simpler option considered: public smoke only.
- Technical debt introduced: no.
- Scalability assessment: recurring watch remains repeatable through existing scripts.
- Refinements made: included fresh-login workers proof and representative authenticated API timing to avoid public-only false confidence.

### 7. Update Documentation and Knowledge

- Docs updated: `history/evidence/luc-5650-production-performance-server-health-watch-2026-06-27.md`; this task file.
- Context updated: `.agents/state/active-mission.md`, `.agents/state/system-health.md`, `.agents/state/module-confidence-ledger.md`, `.agents/state/next-steps.md`, `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable.

## Result Report

[LUC-5650](/LUC/issues/LUC-5650) can close as `DONE / VERIFIED_READ_ONLY / APP_HEALTHY / MARKET_CATALOG_COLD_SAMPLE_WATCH`.

No active outage, 60-second-class dashboard stall, worker outage, rollback trigger, or deployment incident was observed. Residuals remain: stale `SMOKE_AUTH_TOKEN` `401`, one normalized market-catalog cold sample, Coolify application rows reporting `running:unknown`, missing host-level read-only status credentials, and release-grade build provenance remaining with the release/source-control owner.
