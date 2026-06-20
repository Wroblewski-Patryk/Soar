# Task

## Header
- ID: LUC-5213
- Title: Investigate intermittent production API `/ready` timeout and latency outliers
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: [LUC-5198](/LUC/issues/LUC-5198)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / production performance and server-health readiness
- Requirement Rows: not changed
- Quality Scenario Rows: reliability / public API readiness latency
- Risk Rows: production runtime latency outliers
- Iteration: 2026-06-20 LUC-5213
- Operation Mode: BUILDER
- Mission ID: LUC-5213-API-READY-TIMEOUT-INVESTIGATION-2026-06-20
- Mission Status: PARTIALLY_VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the direct backend investigation lane.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the loaded project instructions and current state.
- [x] `.agents/core/mission-control.md` was reviewed through active mission state.
- [x] Missing or template-like state tables were not encountered.
- [x] Affected module confidence rows were identified.
- [x] Affected reliability risk was identified.
- [x] The task improves release confidence by clarifying a production latency signal.

## Mission Block
- Mission objective: classify the production API `/ready` timeout signal from [LUC-5198](/LUC/issues/LUC-5198).
- Release objective advanced: avoid false readiness claims and route any backend repair with evidence.
- Included slices: production public timing repro, backend readiness source inspection, evidence/state updates.
- Explicit exclusions: deploy, restart, rollback, env edits, secret/account readback, DB/Redis mutation, raw log capture.
- Checkpoint cadence: single heartbeat.
- Stop conditions: active timeout reproduced with owner/root cause, or not reproduced with bounded risk classification.
- Handoff expectation: close the issue if no active defect is proven; route future hardening only if recurrence warrants it.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md, Paperclip wake payload | Task/evidence/state closure | Final disposition | Issue update | DONE |
| Backend | Core Backend Engineer | `apps/api/src/router/index.ts`, `runtimeDependencyReadiness.ts` | API readiness source inspection | Bottleneck classification | Source inspection plus production probes | DONE |
| Ops | Not delegated | [LUC-5198](/LUC/issues/LUC-5198), prior DRE evidence | Production timing context | Historical signal consumed | No mutation | DONE |
| Documentation/Memory | Active chat | System health, module ledger | Evidence/task/state rows | Durable proof | Files updated | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed for current Soar state.
- [x] Responsibility lanes were bounded to CBE plus read-only Ops evidence.
- [x] No two write lanes own the same file or shared registry.
- [x] Missing ownership was not found.

## Context

[LUC-5198](/LUC/issues/LUC-5198) found intermittent production API `/ready`
timeouts and outliers while other public routes mostly stayed responsive.
This task investigates whether the source is backend readiness dependencies,
platform/proxy/runtime behavior, or a currently non-reproducible transient.

## Goal

Reproduce or disprove the active `/ready` timeout and identify the most likely
bottleneck class with evidence.

## Success Signal
- User or operator problem: public readiness probe intermittently times out or has high latency.
- Expected product or reliability outcome: production readiness confidence is evidence-backed and no speculative deploy occurs.
- How success will be observed: timing samples and source inspection are recorded.
- Post-launch learning needed: yes.

## Scope

- Production public `GET /health` and `GET /ready` timing only.
- Backend files inspected:
  - `apps/api/src/router/index.ts`
  - `apps/api/src/config/runtimeDependencyReadiness.ts`
  - `apps/api/src/config/criticalSecretsReadiness.ts`
  - `apps/api/src/router/health-readiness.test.ts`
- Evidence/state files updated:
  - `history/evidence/luc-5213-api-ready-timeout-investigation-2026-06-20.md`
  - `history/tasks/luc-5213-api-ready-timeout-investigation-2026-06-20-task.md`
  - `.agents/state/system-health.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`

## Implementation Plan

1. Read Paperclip issue context and prior Soar production health rows.
2. Run focused read-only production timing for `/health` and `/ready`.
3. Inspect backend readiness route and dependency implementation.
4. Decide whether a code/config repair is justified by evidence.
5. Record evidence and update source-of-truth state.

## Acceptance Criteria

- Fresh focused timing exists for API `/health` and `/ready`.
- Backend readiness dependency path is identified.
- Current bottleneck class is stated with evidence.
- If a code change is needed, smallest repair plan is routed.
- No secrets, raw logs, cookies, private IDs, or production mutations occur.

## Constraints

- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay read-only for production

## Definition of Done

- [x] concrete focused timing evidence captured.
- [x] backend readiness source path inspected.
- [x] final disposition posted to Paperclip.

## Stage Exit Criteria

- [x] The output matches `verification`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden

- new systems without approval
- duplicated logic or parallel implementations of readiness
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- deploy, push, restart, rollback, env edit, DB/Redis mutation, secret readback

## Validation Evidence

- Tests: not run; no code changed.
- Manual checks:
  - PowerShell public timing: `/health` 20/20 200, max `6410 ms`; `/ready` 20/20 200, max `4857 ms`; treated as client/tooling noisy because `/health` was worse than `/ready`.
  - Node fetch public timing: `/health` 30/30 200, max `181 ms`; `/ready` 30/30 200, max `145 ms`.
  - `curl.exe` public timing: `/health` 20/20 200, max `1330 ms`; `/ready` 20/20 200, max `987 ms`.
- Screenshots/logs: not applicable.
- High-risk checks: no protected production access or mutation used.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: SOAR-OPERATIONS-001.
- Requirements matrix updated: no.
- Quality scenarios updated: no.
- Risk register updated: no.
- Reality status: partially verified.

## Architecture Evidence

- Architecture source reviewed: API router and readiness configuration source.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: not required; no behavior changed.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no deployment occurred.
- Observability or alerting impact: current evidence suggests recurrence needs DRE/Ops host/proxy/container timing.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: [LUC-5198](/LUC/issues/LUC-5198) recorded one `/ready` timeout plus outliers.
- Gaps: no protected `/ready/details` or host/proxy/log-window evidence in this heartbeat.
- Inconsistencies: current probes did not reproduce the timeout.
- Architecture constraints: readiness exposes public redacted status and protected details.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: issue context, state files, API readiness source, prior evidence.
- Rows created or corrected: LUC-5213 evidence/task/state rows.
- Assumptions recorded: current timing is a non-reproduction, not proof the historical signal was false.
- Blocking unknowns: exact production host/proxy/container state during [LUC-5198](/LUC/issues/LUC-5198).
- Why it was safe to continue: public read-only probes and local source inspection do not mutate state.

### 2. Select One Priority Mission Objective
- Selected task: classify API `/ready` timeout/outliers.
- Priority rationale: critical production readiness signal.
- Why other candidates were deferred: unrelated release blockers already have owners.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state only.
- Logic: no runtime logic changed.
- Edge cases: current non-reproduction cannot erase historical timeout.

### 4. Execute Implementation
- Implementation notes: recorded evidence only; no code patch.

### 5. Verify and Test
- Validation performed: public timing probes and source inspection.
- Result: active `/ready` timeout not reproduced; backend amplification risk identified.

### 6. Self-Review
- Simpler option considered: patch readiness immediately.
- Technical debt introduced: no.
- Scalability assessment: future fix should make Redis/database readiness probes concurrent if recurrence supports backend hardening.
- Refinements made: separated PowerShell client noise from Node/curl evidence.

### 7. Update Documentation and Knowledge
- Docs updated: evidence/task/state rows.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed.
- [x] Operation mode was selected.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Required responsibility lanes were integrated.

## Reliability / Observability Evidence

- `docs/operations/service-reliability-and-observability.md` reviewed: yes.
- Critical user journey: public API readiness check.
- SLI: HTTP success and latency for `GET /ready`.
- SLO: not newly defined in this task.
- Error budget posture: burning for historical signal, healthy for current samples.
- Health/readiness check: `GET /ready` and `GET /health`.
- Logs, dashboard, or alert route: blocked/not used; no raw log capture.
- Smoke command or manual smoke: public Node fetch and `curl.exe` timing probes.
- Rollback or disable path: not applicable; no deployment.

## Security / Privacy Evidence

- Data classification: public route metadata only.
- Trust boundaries: no protected routes, credentials, cookies, or raw logs.
- Permission or ownership checks: production mutation excluded.
- Abuse cases: no account/session access used.
- Secret handling: no secret values read or stored.
- Security tests or scans: not applicable.
- Fail-closed behavior: public readiness remains redacted; protected details remain auth-gated.
- Residual risk: exact production host/proxy/container state during the [LUC-5198](/LUC/issues/LUC-5198) timeout remains unknown.

## Result Report

- Task summary: Investigated [LUC-5198](/LUC/issues/LUC-5198) API `/ready` timeout signal; current focused probes did not reproduce active timeout, and backend source inspection found sequential Redis/database readiness checks as a plausible latency amplifier but not a proven root cause.
- Files changed: evidence/task/state files only.
- How tested: public read-only PowerShell, Node fetch, and `curl.exe` timing probes; local source inspection.
- What is incomplete: host/proxy/container timing and protected `/ready/details` correlation for the original timeout window.
- Next steps: if recurrence appears, DRE/Ops captures host/proxy/container evidence; if backend hardening is authorized, CBE can make Redis/database readiness probes concurrent with focused tests.
- Decisions made: no speculative code patch or deploy from this heartbeat.
