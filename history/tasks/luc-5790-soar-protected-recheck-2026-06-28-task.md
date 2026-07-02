# Task

## Header
- ID: LUC-5790
- Title: [Gate recheck][LUC-241] Soar protected recheck
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: [LUC-241](/LUC/issues/LUC-241)
- Priority: P1
- Module Confidence Rows: not changed; no runtime module implementation changed
- Requirement Rows: protected workers readiness release gate
- Quality Scenario Rows: reliability / production readiness
- Risk Rows: stale smoke token residual; release provenance residual
- Iteration: 2026-06-28 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-5790-SOAR-PROTECTED-RECHECK-2026-06-28
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the bounded verification scope.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified as not applicable.
- [x] The task improves release confidence with fresh production evidence.

## Mission Block
- Mission objective: execute one read-only protected production gate recheck
  for [LUC-241](/LUC/issues/LUC-241).
- Included slices: canonical public smoke, protected workers readiness,
  rollback guard, build-info readback.
- Explicit exclusions: deploy, push, restart, rollback execution, env edit,
  secret/account readback, raw log capture, production mutation, exchange
  action, order, position, or live-trading action.
- Stop conditions: protected smoke pass/fail recorded, blocker owner named if
  unable to proceed.
- Handoff expectation: close child issue with evidence; keep residuals routed
  to Security/Ops and release/source-control owners.

## Context

[LUC-5790](/LUC/issues/LUC-5790) was assigned as a protected recheck child of
[LUC-241](/LUC/issues/LUC-241). The wake requested concrete DRE action in this
heartbeat and did not require broader thread refetch.

## Goal

Prove whether the Soar production protected workers readiness gate is currently
passable without deploy, restart, push, account mutation, or other production
mutation.

## Scope

- Exact runtime surfaces: `https://api.soar.luckysparrow.ch/health`,
  `https://api.soar.luckysparrow.ch/ready`,
  `https://api.soar.luckysparrow.ch/workers/ready`,
  `https://soar.luckysparrow.ch/`,
  `https://soar.luckysparrow.ch/api/build-info`.
- Exact scripts: `scripts/deploySmokeCheck.mjs`,
  `scripts/evaluateRollbackGuard.mjs`.
- Exact docs/evidence changed: this task packet, the matching evidence packet,
  active mission, task board, project state, system health, and next steps.

## Implementation Plan

1. Run canonical deploy smoke with current runner bindings.
2. Clear only the process-local stale `SMOKE_AUTH_TOKEN` and rerun deploy smoke
   through the configured fresh-login path.
3. Run rollback guard with fresh-login auth inputs and no token value captured.
4. Read public Web build-info.
5. Record redaction-safe evidence and final issue disposition.

## Acceptance Criteria

- Public API/Web smoke status is recorded.
- Protected `/workers/ready` status is recorded.
- Rollback guard decision is recorded.
- Build-info provenance status is recorded.
- No production mutation, deploy, restart, secret readback, or account mutation
  occurs.

## Constraints
- use existing smoke and rollback-guard scripts
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within read-only verification

## Definition of Done
- [x] canonical smoke run with current runner bindings is recorded
- [x] fresh-login protected smoke path is recorded
- [x] rollback guard readback is recorded
- [x] source-of-truth context is updated
- [x] issue receives final disposition

## Forbidden
- deploy, push, restart, rollback execution, env edit
- secret/account value readback
- production data, DB, Redis, payment, subscription, exchange, order, position,
  or live-trading mutation
- temporary bypasses

## Validation Evidence
- `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` => FAIL only on protected `/workers/ready` `401` with current `SMOKE_AUTH_TOKEN`.
- `$env:SMOKE_AUTH_TOKEN=''; pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch` => PASS all checks.
- Fresh-login rollback guard => `shouldRollback=false`, `reasons=[]`, workers `status=ready`, `topologyStatus=healthy`, runtime freshness `PASS`, alerts `[]`.
- Web build-info readback => `gitSha=42177530f2a2ddc22832133b545bccab6ab404eb`, `gitRef=main`, `metadataSource=env-runtime`, checked at `2026-06-28T04:03:08.105Z`.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: deployment safety, prior protected recheck
  packets, smoke scripts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none; process-local `SMOKE_AUTH_TOKEN` was cleared for
  the second command only.
- Health-check impact: protected workers readiness verified through fresh login.
- Rollback note: rollback guard returned `shouldRollback=false`, `reasons=[]`.
- Observability or alerting impact: no alerts returned by rollback guard.

## Autonomous Loop Evidence

### 1. Analyze Current State
- [LUC-5790](/LUC/issues/LUC-5790) assigned under parent [LUC-241](/LUC/issues/LUC-241).
- Fresh protected workers readiness fact needed.
- Prior DRE packets showed stale pre-bound token versus fresh-login pass pattern.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-5790](/LUC/issues/LUC-5790).
- Other candidates deferred because the scoped wake forbids switching issues.

### 3. Plan Implementation
- Use existing smoke and rollback scripts; write only evidence/state docs.
- Treat stale token failure as a residual only if fresh-login path passes.

### 4. Execute Implementation
- No product code changed.
- Existing production checks were run read-only.

### 5. Verify and Test
- Deploy smoke, fresh-login deploy smoke, rollback guard, and build-info
  readback were performed.

### 6. Self-Review
- Existing systems were reused.
- No workaround paths, duplicate logic, deploy, or runtime mutation were
  introduced.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence packet, active mission, next steps, project state,
  task board, and system health.
- Learning journal update was not required.

## Result Report

- Task summary: protected production workers readiness recheck completed.
- Files changed: this task/evidence packet and project state ledgers.
- How tested: canonical deploy smoke with current bindings, deploy smoke with
  fresh login-derived auth, rollback guard, build-info readback.
- What is incomplete: stale pre-bound `SMOKE_AUTH_TOKEN` remains invalid;
  release-grade build provenance remains separate.
- Next steps: Security/Ops rotate or remove stale smoke token binding if it
  persists; release/source-control owner handles authoritative build provenance.
- Decisions made: close [LUC-5790](/LUC/issues/LUC-5790) as done because the
  requested protected recheck passed through the configured fresh-login auth
  path.
