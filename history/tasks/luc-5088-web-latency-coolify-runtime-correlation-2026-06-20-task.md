# Task

## Header
- ID: LUC-5088
- Title: Web latency Coolify runtime correlation
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: [LUC-5085](/LUC/issues/LUC-5085), [LUC-5087](/LUC/issues/LUC-5087)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production performance and server-health readiness
- Requirement Rows: production Web/API public availability and latency evidence
- Quality Scenario Rows: public Web latency and deployment observability
- Risk Rows: intermittent production delivery/runtime latency
- Operation Mode: BUILDER
- Mission ID: LUC-5088-WEB-LATENCY-COOLIFY-RUNTIME-CORRELATION-2026-06-20
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` and current state were represented by the loaded project instructions and state files.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: correlate the intermittent production Web `/` latency spike with read-only Coolify/VPS runtime signals.
- Release objective advanced: production performance and server-health readiness.
- Included slices: public timing recheck, public header/cache recheck, Coolify selector/project/environment/resources/deployments readback, evidence/state update, Paperclip disposition.
- Explicit exclusions: deploy, push, restart, rollback, env edit, secret/account readback, database/Redis mutation, raw log capture, account mutation, exchange/trading/payment actions.
- Stop conditions: spike reproduced with evidence; runtime root-cause signal found; or current evidence proves no active spike and leaves residual risk.
- Handoff expectation: close the issue if the requested correlation is complete without a required mutation.

## Context
[LUC-5085](/LUC/issues/LUC-5085) found Web `/` latency spikes up to `21953 ms`.
[LUC-5087](/LUC/issues/LUC-5087) ruled out an obvious Web route/API-fetch
cause and routed Coolify/VPS correlation to DRE.

## Goal
Produce a read-only runtime correlation report with current route timing,
Coolify status/resource/deploy projection, and a clear issue disposition.

## Constraints
- Use only approved read-only checks.
- Do not print or store secret values, raw ids, cookies, internal URLs, DB values, or raw logs.
- Do not mutate production runtime or source control.
- Do not introduce new systems or workaround paths.

## Definition of Done
- [x] Current Web/API public timing rechecked.
- [x] Coolify read-only projection captured without secrets.
- [x] Correlation assessment recorded with residual risk.
- [x] Source-of-truth state/evidence updated.
- [x] Paperclip issue updated to final disposition.

## Validation Evidence
- Tests: `pnpm run -s ops:coolify-stack:env-check:test` PASS (`11/11`).
- Manual checks: public curl timing and headers; Coolify read-only `GET` projection.
- High-risk checks: mutation guard satisfied; only public `curl` and Coolify `GET` calls used.
- Module confidence ledger updated: yes.
- Reality status: partially verified.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable; no mutation.
- Observability or alerting impact: residual need for host/proxy time-series or sanitized log-window access if spike recurs.

## Autonomous Loop Evidence

### 1. Analyze Current State
- [LUC-5085](/LUC/issues/LUC-5085) had a real intermittent spike.
- [LUC-5087](/LUC/issues/LUC-5087) showed current static-route cache behavior and no code root cause.
- Current DRE runner has Coolify API read-only bindings.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-5088](/LUC/issues/LUC-5088), the assigned critical DRE follow-up.

### 3. Plan Implementation
- Run public route timing and headers.
- Query Coolify selector/project/environment/resources/deployments with redacted output.
- Compare current runtime projection against prior evidence.

### 4. Execute Implementation
- Performed read-only probes and wrote evidence/task artifacts.

### 5. Verify and Test
- Current spike did not reproduce; Web `/` stayed `115-136 ms`.
- Coolify projection succeeded; no active deployment rows.
- Coolify checker tests passed; stack env checker still fails closed for deployment env names.

### 6. Self-Review
- No code path changed.
- No workaround or duplicate system introduced.
- Main residual risk is missing host/proxy time-series for the exact [LUC-5085](/LUC/issues/LUC-5085) spike window.

### 7. Update Documentation and Knowledge
- Updated history evidence, task packet, mission state, system health, task board, project state, next steps, and module confidence ledger.

## Result Report
- Task summary: DRE correlation completed. Current production timing is healthy; Coolify API read-only projection succeeded; no active deployment row was visible; `soar-web` restart count `1` is the main runtime clue.
- Files changed: this task packet, evidence report, and state/context ledgers.
- How tested: public curl timing/headers, Coolify read-only API projection, Coolify env checker tests.
- What is incomplete: exact root cause for the [LUC-5085](/LUC/issues/LUC-5085) historical spike is not proven without host/proxy time-series or sanitized log-window evidence.
- Next steps: monitor for recurrence; if repeated, create a bounded DRE follow-up for host/proxy time-series and sanitized `soar-web` log-window access around the recurrence.
