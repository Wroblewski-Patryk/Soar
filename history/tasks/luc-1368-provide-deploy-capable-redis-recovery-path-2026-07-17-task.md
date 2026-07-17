# Task

## Header
- ID: LUC-1368
- Title: [Soar][Protected Gate] Provide deploy-capable Redis recovery path for LUC-1359
- Task Type: release
- Current Stage: release
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: deploy-capable Coolify mutation authority for the Soar production Redis resource
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: production readiness; protected infrastructure mutation; fail-closed credential handling
- Risk Rows: production runtime mutation authorization
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1368-REDIS-RECOVERY-PATH-2026-07-17
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective:
  prove or execute the protected Redis recovery path for the live Soar
  production readiness incident.
- Release objective advanced:
  the protected gate now has a fresh exact blocker instead of another generic
  Redis restart retry.
- Included slices:
  issue context review, live Coolify readback, bearer restart probe, session
  login probe, bounded public smoke, and source-of-truth updates.
- Explicit exclusions:
  no repo runtime-code change, no deploy, no rollback, no environment edit, no
  database mutation, no Redis mutation, no secret disclosure, and no use of
  real user accounts.
- Checkpoint cadence:
  issue context, live readback, protected auth probe, repo truth sync, issue
  disposition.
- Stop conditions:
  a deploy-capable restart path works; or the exact remaining auth blocker is
  reproved.
- Handoff expectation:
  Security Review Lead or Ops Release Lead must provide a deploy-capable
  Coolify credential/session path or perform the one Redis recovery action
  directly.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | issue wake, release contracts, repo state | task framing, closeout, source-of-truth sync | blocked release packet | parent validation | COMPLETE |
| Product/Requirements | coordinator | `LUC-1368`, `LUC-1359` | protected-gate scope only | exact unblock definition | issue/body parity | COMPLETE |
| Architecture | coordinator | readiness code boundary, Coolify resource model | no code path changes | root-cause boundary | existing docs + live readback | COMPLETE |
| Implementation | coordinator | Coolify auth surfaces | live restart-path probes | proof of remaining blocker | HTTP results | COMPLETE |
| QA/Test | coordinator | bounded smoke routes | public health/readiness readback | runtime evidence | curl/Coolify outputs | COMPLETE |
| Security/Ops/UX | coordinator | protected credential policy | bearer and session auth probes | exact owner-path blocker | no secret disclosure | COMPLETE |
| Documentation/Memory | coordinator | task board, project state, system health, history | durable repo truth | evidence + state updates | file updates | COMPLETE |

## Context
`LUC-1374` already proved on Friday, July 17, 2026 that the current Coolify
bearer token can read Soar production state but cannot execute Redis mutation
endpoints. `LUC-1368` is the protected gate that should eliminate that limit or
perform the one allowed Redis recovery action for `LUC-1359`.

## Goal
Either recover the Soar production Redis resource through an approved
deploy-capable path or leave a fresh exact blocker that names the failing auth
surface.

## Success Signal
- User or operator problem:
  Soar API `/ready` is still `503` while production Redis is
  `restarting:unhealthy`.
- Expected product or reliability outcome:
  the next legal owner action is explicit and evidenced.
- How success will be observed:
  either Redis restart is accepted/executed, or both bearer and session auth
  paths are reclassified with exact current failure states.
- Post-launch learning needed: no

## Deliverable For This Stage
A release-stage protected-gate packet with live auth-path evidence and a clear
issue disposition.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] live Redis state and public Soar readiness were rechecked
- [x] bearer-token restart capability was reproved or cleared
- [x] alternate owner session path was reproved or cleared
- [x] the issue was left with an exact blocker and named owner/action

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  not applicable; no repo runtime code changed.
- Manual checks:
  `GET /api/v1/databases/{redis-id}`;
  `POST /api/v1/databases/{redis-id}/restart` with bearer token;
  `curl`-based Coolify session login plus `GET /api/v1/teams/current` and
  `POST /api/v1/databases/{redis-id}/restart`;
  public smoke for `/health`, `/ready`, `/`, and `/api/build-info`.
- Screenshots/logs:
  redacted HTTP status/body summaries only; no screenshots.
- High-risk checks:
  no secret values logged, no cookies persisted after probe, no mutation was
  executed, no production account/browser mutation, and no deploy/restart
  succeeded.
- Module confidence ledger updated: not applicable
- Module confidence rows closed or changed:
  not applicable
- Requirements matrix updated: not applicable
- Requirement rows closed or changed:
  not applicable
- Quality scenarios updated: no
- Quality scenario rows closed or changed:
  not applicable
- Risk register updated: no
- Risk rows closed or changed:
  not applicable
- Reality status: blocked

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  `apps/api/src/router/index.ts`,
  `apps/api/src/config/runtimeDependencyReadiness.ts`,
  `apps/api/src/config/criticalSecretsReadiness.ts`,
  `docs/operations/coolify-vps-deployment-contract.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
  not applicable
- Follow-up architecture doc updates:
  none

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: high
- Env or secret changes:
  none
- Health-check impact:
  no live runtime state changed; public API `/ready` remains `503`
- Smoke steps updated:
  after Redis recovery, rerun `/health`, `/ready`, `/`, `/api/build-info`, and
  protected `/ready/details`
- Rollback note:
  no rollback needed because no successful mutation occurred
- Observability or alerting impact:
  none
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  live Soar readiness still fails on production while Redis is
  `restarting:unhealthy`.
- Gaps:
  no deploy-capable Redis restart path is usable from this runner.
- Inconsistencies:
  new owner-login bindings are now present, but they still do not yield an
  authenticated mutation path.
- Architecture constraints:
  protected Coolify mutation must stay fail-closed when auth is insufficient.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none
- Sources scanned:
  `AGENTS.md`, Paperclip role contracts, `LUC-1359`, `LUC-1374`, `LUC-1387`,
  repo state files, and prior runtime evidence.
- Rows created or corrected:
  `LUC-1368` task/evidence packet plus state summaries.
- Assumptions recorded:
  safe assumption that the injected `COOLIFY_LOGIN_*` bindings were intended as
  the only new possible owner-auth path worth probing.
- Blocking unknowns:
  whether a separate deploy-capable credential path exists outside this runner.
- Why it was safe to continue:
  all probes stayed bounded, redacted, and fail-closed.

### 2. Select One Priority Mission Objective
- Selected task:
  re-prove or clear the protected Redis recovery path.
- Priority rationale:
  it directly blocks the live production readiness incident.
- Why other candidates were deferred:
  no other Soar work can restore `/ready` while Redis remains unhealthy.

### 3. Plan Implementation
- Files or surfaces to modify:
  `history/tasks`, `history/evidence`, `.agents/state/system-health.md`,
  `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`, and the
  current Paperclip issue status/comment.
- Logic:
  test the bearer path, then the session-owner path, then persist the exact
  result.
- Edge cases:
  session login may succeed while API mutation still fails unauthenticated.

### 4. Execute Implementation
- Implementation notes:
  verified the Redis resource by bound resource id; reprobed bearer restart
  (`403 deploy`); reproduced a successful UI login (`200 {"two_factor":false}`)
  via cookie-jar `curl`; then reprobed session-auth API calls and still got
  `401 Unauthenticated`.

### 5. Verify and Test
- Validation performed:
  focused Coolify API reads, focused auth-path probes, and public runtime
  smoke.
- Result:
  blocked; no deploy-capable restart path is present in this runner on Friday,
  July 17, 2026.

### 6. Self-Review
- Simpler option considered:
  stopping after the repeated bearer `403`.
- Technical debt introduced: no
- Scalability assessment:
  the packet is reusable for future protected recovery gates because it
  distinguishes read-only token failure from failed owner-session API auth.
- Refinements made:
  added the alternate session-auth probe instead of repeating the same bearer
  failure.

### 7. Update Documentation and Knowledge
- Docs updated:
  task/evidence packet plus runtime state summaries.
- Context updated:
  yes
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.
