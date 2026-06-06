# Task

## Header
- ID: LUC-2373
- Title: Repair residual guardrail drift after LUC-2365 recheck
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: 09 TSA / Coordinator
- Depends on: [LUC-2365](/LUC/issues/LUC-2365)
- Priority: P0
- Module Confidence Rows: Bot Runtime API, Architecture Evidence Graph, Release Guardrails
- Requirement Rows: release guardrail zero-drift proof
- Risk Rows: release promotion blocked by stale graph drift
- Operation Mode: BUILDER
- Mission ID: LUC-2373-RESIDUAL-GUARDRAIL-DRIFT-2026-06-06
- Mission Status: VERIFIED

## Context
[LUC-2365](/LUC/issues/LUC-2365) resumed after [LUC-2364](/LUC/issues/LUC-2364) and found that `pnpm run quality:guardrails` still failed on architecture graph drift. The scoped wake required concrete repair, not a plan.

## Goal
Close the residual architecture graph drift in the current dirty set without weakening guardrails or mutating production.

## Scope
- `docs/architecture/registry/nodes.csv`
- generated architecture graph/node/status outputs from `pnpm run architecture:graph:generate` and `pnpm run architecture:graph:drift:strict`
- source-of-truth state/task records for this issue

## Implementation Plan
1. Reproduce strict graph drift from the current checkout.
2. Identify the missing API service path and map the real extracted helper files to the existing Bot Runtime aggregate graph node.
3. Regenerate architecture graph outputs.
4. Rerun strict drift, full repository guardrails, and whitespace check.
5. Record evidence and residual release blockers.

## Acceptance Criteria
- `pnpm run architecture:graph:drift:strict` passes with `0` missing representative paths.
- `pnpm run quality:guardrails` passes.
- `git diff --check` has no actionable whitespace failures.
- No push, deploy, restart, rollback, protected-smoke, secret readback, exchange, account, or live-trading mutation occurs.

## Definition of Done
- [x] Residual graph drift repaired through registry/generator path.
- [x] Guardrails pass from the current checkout.
- [x] Source-of-truth task/state records updated.
- [x] Production mutation boundary preserved.

## Validation Evidence
- Tests:
  - `corepack pnpm run architecture:graph:generate` -> PASS, `653` nodes / `842` relations / `27` chains.
  - `corepack pnpm run architecture:graph:drift:strict` -> PASS, `831/831` covered / `0` missing.
  - `corepack pnpm run quality:guardrails` -> PASS.
- Manual checks:
  - `git diff --check` -> PASS with LF/CRLF warnings only.
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/registry/nodes.csv`, generated graph outputs, `docs/status/architecture-graph-drift.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, the stale drift symptom named a non-existent projection service path; the actual extracted aggregate helper files are `runtimeMonitoringAggregateFallbacks.service.ts`, `runtimeMonitoringAggregateProjectors.ts`, and `runtimeMonitoringAggregateRuntime.service.ts`.
- Decision required from user: no.
- Follow-up architecture doc updates: generated node `SOAR-SERVICE-RUNTIME-AGGREGATE` now lists the extracted helper files.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable; no runtime mutation.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `quality:guardrails` failed because strict graph drift reported missing API service coverage.
- Gaps: residual Bot Runtime aggregate helper graph mapping.
- Architecture constraints: use existing graph registry and generator, no guardrail bypass.

### 2. Select One Priority Mission Objective
- Selected task: close [LUC-2373](/LUC/issues/LUC-2373) residual guardrail drift.
- Priority rationale: [LUC-2365](/LUC/issues/LUC-2365) push/promotion decision is blocked until guardrails pass.

### 3. Plan Implementation
- Files or surfaces to modify: graph registry and generated graph/status outputs.
- Logic: map real helper files as related files on the existing runtime aggregate service node.

### 4. Execute Implementation
- Implementation notes: added extracted runtime aggregate helper files to `SOAR-SERVICE-RUNTIME-AGGREGATE` and regenerated graph outputs.

### 5. Verify and Test
- Validation performed: graph generation, strict graph drift, full guardrails, whitespace check.
- Result: pass.

### 6. Self-Review
- Simpler option considered: ignore or allowlist the missing path. Rejected because it would weaken the graph drift guardrail.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: graph registry/generated node/status outputs and task/state records.
- Context updated: yes.
- Learning journal updated: not applicable.

## Result Report
- Task summary: residual graph drift repaired by mapping extracted Bot Runtime aggregate helper files to the existing aggregate service node.
- Files changed: architecture registry/generated graph outputs, drift status artifact, task/state records.
- How tested: `architecture:graph:generate`, `architecture:graph:drift:strict`, `quality:guardrails`, `git diff --check`.
- What is incomplete: release remains blocked by dirty source-state closure, protected runtime/SLO proof inputs, RC Gate 2, and explicit Ops production mutation permit.
- Next steps: [LUC-2365](/LUC/issues/LUC-2365) can treat guardrails as unblocked and continue through [LUC-2374](/LUC/issues/LUC-2374), [LUC-2372](/LUC/issues/LUC-2372), and [LUC-2366](/LUC/issues/LUC-2366).
- Decisions made: no workaround or wildcard guardrail bypass was introduced.
