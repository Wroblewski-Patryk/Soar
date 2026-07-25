# Task

## Header
- ID: LUC-1878
- Title: [Softwarehouse][Owner Path Restore] Provide board-capable deploy owner for Soar workers-market-data recovery
- Task Type: release
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: live Paperclip roster; Coolify owner-path governance
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: production recovery ownership; deploy-capable owner path
- Risk Rows: production runtime health; false-runnable routing
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1878-OWNER-PATH-RESTORE-2026-07-25
- Mission Status: VERIFIED

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
  restore one real owner path above DRE for the exact `workers-market-data`
  Coolify mutation boundary.
- Release objective advanced:
  the blocked worker lane now has an active board-capable operational owner
  instead of another false DRE retry.
- Included slices:
  Paperclip heartbeat context readback, live roster verification, owner-path
  child issue creation, closeout evidence, and repo-truth sync.
- Explicit exclusions:
  no production mutation, no deploy, no restart, no rollback, no secret
  readback, no repo product-code change.
- Checkpoint cadence:
  context readback, roster proof, child-issue creation, closeout, state sync.
- Stop conditions:
  a board-capable owner is assigned; or exact owner execution occurs in this
  lane; or an authorization boundary prevents further routing changes.
- Handoff expectation:
  `LUC-1879` now owns either the exact `workers-market-data` recovery action or
  designation of an equivalent active deploy-capable owner.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, issue body, Paperclip heartbeat context | issue routing, closeout, repo truth | owner-path restore packet | issue + roster readback | COMPLETE |
| Product/Requirements | coordinator | issue contract | bounded DoD | exact owner-path objective | issue/body parity | COMPLETE |
| Architecture | coordinator | Soar ops/deploy governance | ownership interpretation only | role-aligned routing choice | role and contract readback | COMPLETE |
| Implementation | coordinator | Paperclip issue API | `LUC-1879` creation | active board-capable follow-up | API create response | COMPLETE |
| QA/Test | coordinator | focused control-plane checks | issue state evidence | durable control-plane proof | heartbeat/agents readback | COMPLETE |
| Security/Ops/UX | coordinator | safety contracts | secret-safe routing | no-secret owner-path handoff | bounded API actions only | COMPLETE |
| Documentation/Memory | coordinator | task board, responsibility learning, task file | durable repo truth | synced state packet | file updates | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-1872` and `LUC-1868` already proved the exact `workers-market-data`
Coolify write path still fails with `403 Missing required permissions:
deploy`. `LUC-1878` exists only to restore one real owner path above DRE after
fresh roster proof showed no active `Ops Release Lead`.

## Goal
Create or activate a real board-capable operational owner path for the exact
`workers-market-data` recovery boundary.

## Success Signal
- User or operator problem:
  DRE has no legal or effective path to recover `workers-market-data`.
- Expected product or reliability outcome:
  the blocked recovery is owned by an active board-capable operator path
  instead of another denied retry.
- How success will be observed:
  a live child issue exists with the right owner and scope.
- Post-launch learning needed: yes

## Deliverable For This Stage
A release-lane owner-path restoration packet with a live follow-up issue,
closeout evidence, and source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] live roster proof confirmed the expected deploy-capable owner was absent.
- [x] one real board-capable operational follow-up issue was created.
- [x] repo truth and Paperclip closeout both record the resulting owner path.

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
  not applicable; no code change.
- Manual checks:
  `GET /api/issues/LUC-1878/heartbeat-context`,
  `GET /api/companies/{companyId}/agents`,
  `POST /api/companies/{companyId}/issues` -> `LUC-1879`,
  `POST /api/issues/LUC-1878/comments`.
- Screenshots/logs:
  none.
- High-risk checks:
  no production mutation, no deploy/start/restart attempt, no secret value
  disclosure, no repo code change.
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
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  deploy/runtime ownership contracts in `AGENTS.md` and issue lineage only.
- Fits approved architecture: yes
- Mismatch discovered: yes
- Decision required from user: no
- Approval reference if architecture changed:
  not applicable
- Follow-up architecture doc updates:
  none; routing gap captured in responsibility learning and task board.

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none applied
- Env or secret changes:
  none
- Health-check impact:
  none; this lane did not touch runtime state
- Smoke steps updated:
  none
- Rollback note:
  not applicable
- Observability or alerting impact:
  none
- Staged rollout or feature flag:
  not applicable

## Result Report
- Outcome:
  created [LUC-1879](/LUC/issues/LUC-1879) assigned to `04 COO` as the active
  board-capable operational path for the exact `workers-market-data` recovery
  boundary.
- Residual risk:
  this lane could not patch [LUC-1877](/LUC/issues/LUC-1877) directly because
  the Paperclip API returned `Issue is outside this actor's authorization
  boundary`.
- Next owner:
  `04 COO` through `LUC-1879`.
