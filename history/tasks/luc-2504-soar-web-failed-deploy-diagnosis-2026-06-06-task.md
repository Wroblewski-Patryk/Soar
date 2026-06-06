# Task

## Header
- ID: LUC-2504
- Title: Read-only soar-web failed deploy diagnosis after LUC-2499
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: [LUC-2499](/LUC/issues/LUC-2499)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: not changed
- Quality Scenario Rows: operations reliability / deployment health
- Risk Rows: production deploy source-provenance ambiguity
- Iteration: 2026-06-06
- Operation Mode: TESTER
- Mission ID: LUC-2504-SOAR-WEB-FAILED-DEPLOY-DIAGNOSIS-2026-06-06
- Mission Status: VERIFIED

## Context

[LUC-2499](/LUC/issues/LUC-2499) verified public API/Web health but found that
Coolify `soar-web` metadata still reports `git_commit_sha=b894e5dd...` while
public Web build-info reports `56d8d440...`, and Web logs contain Next.js
Server Action mismatch errors.

## Goal

Correlate current read-only `soar-web` metadata, deployment endpoint exposure,
sanitized logs, and public Web checks to decide whether the mismatch requires a
separate approved production mutation or can be closed as a diagnosis with
residual provenance risk.

## Scope

- Paperclip heartbeat context for [LUC-2504](/LUC/issues/LUC-2504).
- Public Web `/` and `/api/build-info`.
- Coolify read-only `soar-web` and `soar-api` application metadata.
- Coolify read-only deployment endpoint variants available to the current
  token.
- Coolify read-only `soar-web` log endpoint, summarized and redacted.
- Prior recovery artifacts from [LUC-2285](/LUC/issues/LUC-2285),
  [LUC-2286](/LUC/issues/LUC-2286), [LUC-2302](/LUC/issues/LUC-2302), and
  [LUC-2304](/LUC/issues/LUC-2304).

## Implementation Plan

1. Consume scoped wake payload and heartbeat context; do not repeat checkout
   because the harness already claimed it.
2. Review [LUC-2499](/LUC/issues/LUC-2499) evidence and prior Web recovery
   artifacts.
3. Run public Web root and build-info probes.
4. Run read-only Coolify app, logs, and deployment endpoint probes.
5. Classify whether the finding justifies production mutation.
6. Record evidence and update local state.
7. Close the Paperclip issue with a durable disposition.

## Acceptance Criteria

- Public Web health and build-info status are recorded.
- Coolify app metadata and deployment endpoint exposure are recorded without
  raw ids or secrets.
- Web Server Action mismatch log signal is classified.
- Production mutation decision is explicit.
- Residual risk and next owner/action are recorded.

## Definition of Done

- [x] Read-only diagnosis evidence is recorded.
- [x] No production mutation occurred.
- [x] The mismatch is classified with residual risk.
- [x] Source-of-truth state is updated.
- [x] Paperclip receives a final disposition.

## Forbidden

- Deploy, restart, rollback, force start, or clear queues.
- Protected smoke or authenticated account journeys.
- Secret value, cookie, token, account, raw resource id, raw deployment id,
  generated container/network/host details, or exchange credential readback.
- Treat `metadataSource=github-branch` as authoritative container-source proof.

## Validation Evidence

- Tests: not applicable for read-only production diagnosis.
- Manual checks:
  - Paperclip heartbeat-context readback -> PASS.
  - Public Web `/` -> `200`.
  - Public Web `/api/build-info` -> `200`,
    `gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493`,
    `metadataSource=github-branch`.
  - Coolify `soar-web` app metadata -> `200`, configured
    `git_commit_sha=b894e5dd30614dfd2035e91e3d848c842d3ff380`,
    status `running:unknown`.
  - Coolify deployment endpoint variants -> no queued/in-progress/failed or
    historical rows visible to this token; app-specific deployments path
    returned `404`.
  - Coolify Web logs endpoint -> `200`, static Server Action mismatch signal
    observed.
- Screenshots/logs:
  - `history/evidence/luc-2504-soar-web-failed-deploy-diagnosis-2026-06-06.md`.
- High-risk checks:
  - No deploy/restart/rollback/env/database/account/secret/exchange/protected
    smoke/live-trading mutation occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified for read-only diagnosis; release provenance remains
  partially verified.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no rollback trigger from current evidence; public Web is
  reachable and deployment queues/history visible to this token are empty.
- Observability or alerting impact: Server Action mismatch is classified as
  stale-client/deploy-transition noise unless it starts growing or coincides
  with public Web failure.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Web metadata/build-info mismatch and Server Action mismatch logs.
- Gaps: build-info source provenance is weak because metadata source is
  `github-branch`.
- Inconsistencies: Coolify configured `git_commit_sha` still shows the prior
  rollback candidate `b894e5dd...`.
- Architecture constraints: deploy mutation remains approval-gated.

### 2. Select One Priority Mission Objective
- Selected task: close read-only `soar-web` failed-deploy diagnosis.
- Priority rationale: critical production deploy confidence follow-up from
  [LUC-2499](/LUC/issues/LUC-2499).
- Why other candidates were deferred: protected release proof remains in the
  existing Security/Ops chain and is outside this read-only child issue.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task/state only.
- Logic: classify runtime/deploy signal from read-only facts.
- Edge cases: avoid treating public build-info fallback as definitive image
  source proof.

### 4. Execute Implementation
- Implementation notes: no code or runtime mutation; read-only probes only.

### 5. Verify and Test
- Validation performed: public Web probes, Coolify read-only app/log/deployment
  endpoint probes, prior evidence review.
- Result: no active failed deployment evidence requiring mutation.

### 6. Self-Review
- Simpler option considered: close based only on [LUC-2499](/LUC/issues/LUC-2499);
  rejected because build-info metadata source needed source-code inspection.
- Technical debt introduced: no.
- Scalability assessment: diagnosis uses existing evidence conventions.
- Refinements made: separated current no-mutation decision from source
  provenance residual risk.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence/state files.
- Context updated: active mission, next steps, project state, task board, system
  health, module confidence ledger.
- Learning journal updated: not applicable; the build-info provenance issue is
  a current residual gap, not a newly confirmed recurring pitfall.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report

- Task summary: current evidence does not justify production mutation. Web is
  reachable; build-info reports `56d8d440...`; Coolify metadata still shows
  older `b894e5dd...`; deployment endpoints show no visible active failed rows;
  Web logs contain static Server Action mismatch entries consistent with stale
  clients after deploy/recovery.
- Files changed:
  - `history/evidence/luc-2504-soar-web-failed-deploy-diagnosis-2026-06-06.md`
  - `history/tasks/luc-2504-soar-web-failed-deploy-diagnosis-2026-06-06-task.md`
  - state/context files updated with the mission summary.
- How tested: public Web probes, Coolify read-only API probes, source/evidence
  inspection.
- What is incomplete: authoritative Web container source provenance; build-info
  is currently `metadataSource=github-branch`.
- Next steps: no immediate production mutation. [LUC-2506](/LUC/issues/LUC-2506)
  owns the separate hardening lane to restore authoritative build-info/source
  metadata before treating Web build-info as exact container-source proof for
  release gates; Paperclip immediately checked it out in a separate DRE run.
- Decisions made: close [LUC-2504](/LUC/issues/LUC-2504) as done for read-only
  diagnosis and keep full protected release readiness fail-closed in the
  existing protected chain.
