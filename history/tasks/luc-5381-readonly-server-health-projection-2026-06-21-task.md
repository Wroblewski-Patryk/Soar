# Task

## Header
- ID: LUC-5381
- Title: Resume read-only server-health projection after LUC-4811 binding closure
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: [LUC-4811](/LUC/issues/LUC-4811)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production performance and server-health
- Requirement Rows: not changed; evidence refresh only
- Quality Scenario Rows: deployment health, worker readiness, runtime freshness
- Risk Rows: host-level VPS pressure/log depth remains residual
- Iteration: 2026-06-21 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-5381-READONLY-SERVER-HEALTH-PROJECTION-2026-06-21
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this issue-scoped DRE heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was covered by active project startup context.
- [x] `.agents/core/mission-control.md` was covered by active project startup context.
- [x] Missing or template-like state tables were not relevant to this evidence-only health projection.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: produce a redaction-safe read-only Soar server-health projection after [LUC-4811](/LUC/issues/LUC-4811) binding closure.
- Release objective advanced: production app, worker, DB/Redis, Coolify, runtime freshness, and rollback posture confidence.
- Included slices: names-only binding scan, Coolify `GET` projection, public smoke, protected worker readiness, rollback guard.
- Explicit exclusions: deploy, push, restart, rollback, env edit, DB/Redis mutation, account mutation, secret value readback, raw logs, screenshots, exchange actions, payment/subscription mutation, live trading.
- Checkpoint cadence: one heartbeat verification closure.
- Stop conditions: Coolify readback failure, public/protected smoke failure, rollback guard indicating rollback, or missing required binding names.
- Handoff expectation: close the issue if read-only proof is captured; block only on first-class missing owner/action.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | DRE active chat | Wake payload, Soar AGENTS, DRE role | Task/evidence/state integration | Closure packet | Final issue update | DONE |
| Ops/Release | DRE active chat | Coolify/VPS deployment contract, smoke scripts | Production health projection | Redaction-safe evidence | Coolify GETs, smoke, rollback guard | DONE |
| Security | DRE active chat | Credentials contract | Secret handling boundary | Names-only scan | No values stored | DONE |
| Documentation/Memory | DRE active chat | Project state files | Evidence/task/state updates | Durable source-of-truth sync | File diff review | DONE |

## Context
[LUC-5378](/LUC/issues/LUC-5378) created [LUC-5381](/LUC/issues/LUC-5381)
because [LUC-4811](/LUC/issues/LUC-4811) closed the old Coolify binding
blocker and DRE needed to resume the read-only server-health projection.

## Goal
Verify, without exposing secret values or mutating production, whether the DRE
runner can read current Soar production server-health evidence and publish a
redaction-safe projection.

## Scope
- Names-only binding scan for Coolify/VPS/protected status families.
- Read-only Coolify project/environment/resource/deployment projection.
- Existing production public smoke and protected worker-readiness smoke.
- Existing rollback guard runtime freshness and alert projection.
- Minimal source-of-truth state updates.

## Implementation Plan
1. Acknowledge the scoped wake and keep the task on [LUC-5381](/LUC/issues/LUC-5381).
2. Run names-only environment scan.
3. Run the existing Coolify stack env checker tests.
4. Query Coolify through read-only `GET` endpoints and store only sanitized counts/statuses.
5. Run public smoke and protected worker-readiness smoke.
6. Run rollback guard with auth mapped in-process from the existing smoke credential family.
7. Record evidence, update project state, and close the issue.

## Acceptance Criteria
- Binding scan reports required Coolify/VPS binding names present or exact missing families.
- Read-only server-health projection is captured, or the issue is blocked with named owner/action.
- No deploy, restart, rollback, env edit, DB/Redis mutation, account mutation, secret readback, screenshot, raw log capture, or live-trading action occurs.

## Definition of Done
- [x] Binding names scanned without value disclosure.
- [x] Read-only server-health projection captured.
- [x] Public and protected app/worker readiness verified through existing scripts.
- [x] Runtime freshness/rollback guard captured.
- [x] Evidence and project state updated.
- [x] No prohibited production mutation occurred.

## Validation Evidence
- `pnpm run -s ops:coolify-stack:env-check:test` -> PASS (`11/11`).
- Names-only scan found `COOLIFY_*`, `VPS_HOST`, and `SMOKE_AUTH_*` names.
- Names-only scan did not find `SSH*`, dedicated read-only `VPS_*` status credentials beyond `VPS_HOST`, `ROLLBACK_GUARD_*`, `SOAR_PROD*`, `PROD_DB_CHECK*`, `PRODUCTION_DB_CHECK*`, `RC_*`, or `GATE*` names.
- Coolify read-only `GET` projection -> PASS:
  - selector: `LuckySparrow`
  - configured project: `Soar`
  - production environment: `production`
  - visible projects: `5`
  - global resources: `17`
  - visible deployment rows: `0`
  - production applications: `6`
  - PostgreSQL/Redis: `running:healthy`
  - application rows: `running:unknown`
- Public smoke without workers -> PASS.
- Protected smoke after clearing stale token and using env-bound login -> PASS, including `/workers/ready` `200`.
- Rollback guard -> PASS:
  `shouldRollback=false`, no reasons, worker topology `healthy`, freshness
  `PASS`, running sessions `5`, alerts empty.
- Evidence:
  `history/evidence/luc-5381-readonly-server-health-projection-2026-06-21.md`.

## Architecture Evidence
- Architecture source reviewed: Soar AGENTS and current operations state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; no architecture or runtime behavior changed.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: read-only verification only.
- Smoke steps updated: no.
- Rollback note: rollback guard returned `shouldRollback=false`; no rollback performed.
- Observability or alerting impact: no alert/config change; alerts readback returned empty.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence
- Data classification: operational metadata, redaction-safe.
- Trust boundaries: Coolify API and protected Soar ops endpoints.
- Permission or ownership checks: used injected DRE runner binding names only.
- Secret handling: names-only scans; no secret values printed or stored.
- Fail-closed behavior: protected worker readiness was run through the approved login path after clearing the stale token path.
- Residual risk: host-level VPS pressure and sanitized log-window evidence were not attempted because this runner exposes only `VPS_HOST`, not a read-only SSH/VPS status credential family.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: [LUC-4811](/LUC/issues/LUC-4811) binding blocker is closed; [LUC-5381](/LUC/issues/LUC-5381) is assigned and actionable.
- Gaps: host-level VPS pressure/log depth remains unavailable.
- Inconsistencies: Coolify app rows report `running:unknown`, so app/worker/runtime checks are required.
- Architecture constraints: no mutation, no workaround, use existing ops scripts.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-5381](/LUC/issues/LUC-5381).
- Priority rationale: scoped critical DRE wake.
- Why other candidates were deferred: wake contract forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: task/evidence/state docs only.
- Logic: run redaction-safe existing operational checks.
- Edge cases: stale auth token path, Coolify app `running:unknown`, missing SSH/VPS host-depth credentials.

### 4. Execute Implementation
- Implementation notes: no runtime implementation; evidence-only read-only verification.

### 5. Verify and Test
- Validation performed: Coolify checker tests, names-only scan, Coolify GET projection, public smoke, protected smoke, rollback guard.
- Result: PASS with host-depth residual.

### 6. Self-Review
- Simpler option considered: reuse [LUC-4767](/LUC/issues/LUC-4767) evidence only.
- Technical debt introduced: no.
- Scalability assessment: evidence uses existing repeatable scripts and Coolify GET projection.
- Refinements made: recorded host-depth boundary separately from app health.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence/state files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report
- Task summary: completed the DRE read-only server-health projection after binding closure; Soar production is app/worker/runtime healthy and rollback is not indicated.
- Files changed:
  - `history/evidence/luc-5381-readonly-server-health-projection-2026-06-21.md`
  - `history/tasks/luc-5381-readonly-server-health-projection-2026-06-21-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: Coolify checker tests, Coolify GET projection, public smoke, protected smoke, rollback guard.
- What is incomplete: host-level VPS CPU/memory/disk/proxy/container-engine pressure and sanitized log-window capture remain unavailable without approved read-only SSH/VPS status credentials beyond `VPS_HOST`.
- Next steps: keep routine DRE production watch; if deeper host pressure is required, route a narrow Security/Ops binding issue for read-only SSH/VPS status credentials.
- Decisions made: close [LUC-5381](/LUC/issues/LUC-5381) as read-only verified rather than blocked, because the requested Coolify/DB/Redis/worker/runtime projection is captured and host-pressure depth is a residual capability gap.
