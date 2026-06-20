# Task

## Header
- ID: LUC-5087
- Title: Investigate production Web home latency spikes found by LUC-5085
- Task Type: research
- Current Stage: verification
- Status: DONE_WITH_DRE_FOLLOW_UP
- Owner: CTO
- Depends on: [LUC-5085](/LUC/issues/LUC-5085)
- Priority: P0
- Module Confidence Rows: Web public home / production delivery
- Requirement Rows: not changed
- Quality Scenario Rows: production public Web latency
- Risk Rows: intermittent production delivery latency
- Iteration: 2026-06-20
- Operation Mode: BUILDER
- Mission ID: LUC-5087-WEB-HOME-LATENCY-INVESTIGATION-2026-06-20
- Mission Status: PARTIALLY_VERIFIED

## Context

[LUC-5085](/LUC/issues/LUC-5085) found intermittent production Web `/` latency
spikes up to `21953 ms` while adjacent public Web/API checks stayed fast.
[LUC-5087](/LUC/issues/LUC-5087) was assigned to CTO to determine whether the
fix belonged to Web/runtime code or Ops/DRE routing.

## Goal

Reproduce and classify the production Web `/` latency spike, patch only if the
evidence identifies a Web/runtime code defect, and otherwise route one exact
owner follow-up with evidence.

## Constraints

- Read-only production diagnosis only.
- No deploy, restart, rollback, env edit, DB/Redis mutation, secret readback,
  account mutation, exchange/trading action, raw sensitive log capture, or
  production configuration change.
- Do not broaden this issue into the existing Coolify/VPS binding lane.

## Definition of Done

- [x] Production timing recheck recorded.
- [x] Route implementation and static build/cache behavior checked.
- [x] Root-cause hypothesis recorded with affected routes/resources.
- [x] Exact owner follow-up routed when code-level fix was not supported.
- [x] Source-of-truth evidence updated.

## Validation Evidence

- Tests: not applicable; no code changed.
- Manual checks:
  - Paperclip heartbeat-context readback for [LUC-5087](/LUC/issues/LUC-5087).
  - `curl.exe` eight-sample production timing recheck for `/`,
    `/auth/login`, `/api/build-info`, and `/hero-sky.webp`.
  - `curl.exe -I` header checks for `/` and `/auth/login`.
  - Local `.next` prerender manifest readback for `/` and `/auth/login`.
- Screenshots/logs: none.
- High-risk checks: production was read-only; no secrets or raw sensitive logs
  were captured.
- Module confidence ledger updated: no, no module code state changed.
- Requirements matrix updated: no.
- Quality scenarios updated: no.
- Risk register updated: no; risk is tracked through [LUC-5088](/LUC/issues/LUC-5088).
- Reality status: partially verified.

## Architecture Evidence

- Architecture source reviewed: `docs/status/view-map-browser-workflow-ownership.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; no code or architecture behavior changed.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: DRE follow-up required for runtime
  correlation.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production Web `/` had intermittent multi-second public latency.
- Gaps: current CTO runner lacks approved read-only Coolify/VPS bindings.
- Inconsistencies: current public recheck is healthy while prior
  [LUC-5085](/LUC/issues/LUC-5085) samples were slow.
- Architecture constraints: public home route must stay static and public;
  no production mutation without release approval.

### 2. Select One Priority Mission Objective
- Selected task: classify Web `/` latency ownership for [LUC-5087](/LUC/issues/LUC-5087).
- Priority rationale: critical production user-visible latency signal.
- Why other candidates were deferred: Coolify/VPS binding repair remains a
  separate release blocker and is not owned by this issue.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state only.
- Logic: compare production timing, headers, local build static manifest, and
  route implementation.
- Edge cases: transient spikes may not reproduce in a short sample; route-level
  evidence must not overclaim.

### 4. Execute Implementation
- Implementation notes: no code change was made because `/` is already
  prerendered/static and current production cache headers are healthy.

### 5. Verify and Test
- Validation performed: see `Validation Evidence`.
- Result: no code bottleneck identified; DRE runtime correlation follow-up
  created.

### 6. Self-Review
- Simpler option considered: adding a speculative Web patch.
- Technical debt introduced: no.
- Scalability assessment: follow-up asks for runtime correlation rather than
  route-level speculation.
- Refinements made: included static cache/header evidence and asset timing.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `history/evidence/luc-5087-web-home-latency-investigation-2026-06-20.md`
  - `history/tasks/luc-5087-web-home-latency-investigation-2026-06-20-task.md`
- Context updated: `.agents/state/system-health.md`,
  `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`.
- Learning journal updated: not applicable.

## Result Report

- Task summary: [LUC-5087](/LUC/issues/LUC-5087) found no supported Web code
  fix. The public home route is prerendered/static, current `/` timing is
  healthy, and current headers show a Next prerender cache hit. The prior spike
  remains a real intermittent production delivery/runtime signal.
- Files changed: evidence/task/state only.
- How tested: production read-only timing/header probes and local build
  manifest/code inspection.
- What is incomplete: Coolify/VPS/container/proxy correlation cannot run in
  this CTO runner without approved read-only bindings.
- Next steps: [LUC-5088](/LUC/issues/LUC-5088) DRE read-only runtime
  correlation.
- Decisions made: no code patch; route to DRE/Ops for runtime correlation.
