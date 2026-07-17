# Task

## Header
- ID: LUC-1387
- Title: [Soar][Security/Ops] Restore least-privilege Coolify owner path for one Redis recovery action
- Task Type: release
- Current Stage: implementation
- Status: REVIEW
- Owner: Security
- Depends on: board/operator acceptance of the exact one-action owner path
- Priority: P0
- Module Confidence Rows: not applicable
- Requirement Rows: not applicable
- Quality Scenario Rows: production Redis recovery authorization; production readiness unblock path
- Risk Rows: production runtime mutation authorization
- Iteration: 1
- Operation Mode: BUILDER
- Mission ID: LUC-1387-REDIS-OWNER-PATH-2026-07-17
- Mission Status: PARTIALLY_VERIFIED

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
  restore a least-privilege authorized owner path for exactly one Soar
  production Redis recovery action.
- Release objective advanced:
  the remaining Redis blocker is now routed to a typed board/operator decision
  instead of an unowned `403` retry loop.
- Included slices:
  issue-context review, roster verification, owner-path decision packet,
  source-of-truth updates, and formal confirmation handoff.
- Explicit exclusions:
  no secret handling, no Coolify credential expansion, no deploy, no rollback,
  no env edit, no database write, and no Redis mutation from this runner.
- Checkpoint cadence:
  issue context, roster confirmation, repo truth updates, confirmation request,
  final disposition.
- Stop conditions:
  the exact owner path is accepted by board/operator; or the issue rests on a
  typed waiting path for that acceptance.
- Handoff expectation:
  board/operator either approves the single Redis restart lane or rejects live
  mutation for this cycle with a reason.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | issue wake, shared credential/release contracts | issue framing, closeout, repo truth | owner-path packet | parent validation | COMPLETE |
| Product/Requirements | coordinator | issue body | scoped unblock definition | exact one-action scope | issue/body parity | COMPLETE |
| Architecture | coordinator | Coolify/runtime state | owner boundary only | no-credential-broadening decision | prior DRE evidence | COMPLETE |
| Implementation | coordinator | Paperclip issue + repo docs/state | task/evidence/state updates; confirmation interaction | formal owner-path restoration lane | API interaction + file updates | COMPLETE |
| QA/Test | coordinator | DRE evidence packet | bounded verification reuse | no new runtime mutation needed | comment/evidence cross-check | COMPLETE |
| Security/Ops/UX | coordinator | shared credential policy; deploy safety | risk note and least-privilege route | fail-closed authorization path | roster + policy review | COMPLETE |
| Documentation/Memory | coordinator | task board, project state, system health, history | durable repo truth | updated state + evidence packet | file updates | COMPLETE |

## Context
`LUC-1374` already proved on Friday, July 17, 2026 that direct Coolify Redis
`restart`, `start`, and `stop` mutation probes return
`403 Missing required permissions: deploy`. `LUC-1382` narrowed the correct
next step to a least-privilege owner-path restoration instead of repeating the
same token set or broadening production authority. The current roster exposes
`09 DRE` for diagnosis and `10 CLO` / `10 SPA` for security review, but no
separate active Ops Release Lead agent for direct Coolify mutation execution.

## Goal
Leave a durable, exact, least-privilege owner path for one Redis recovery
action, with a real approval/interaction route instead of silent `in_progress`.

## Success Signal
- User or operator problem:
  Redis recovery is blocked by missing deploy permission in the current runner.
- Expected product or reliability outcome:
  the next legal mutation owner and exact action are explicit and reviewable.
- How success will be observed:
  `LUC-1387` contains a typed `request_confirmation` interaction and the repo
  truth names the same scoped owner path.
- Post-launch learning needed: no

## Deliverable For This Stage
A release-stage owner-path packet plus a typed board/operator confirmation
request for the single Redis restart lane.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] the least-privilege owner-path decision was narrowed to one Redis recovery action only
- [x] the repo source of truth records the exact owner/action and redacted evidence basis
- [x] the issue rests on a typed review/confirmation path instead of silent `in_progress`

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
  Paperclip heartbeat context, related issue comments, company roster, and
  existing DRE evidence packet.
- Screenshots/logs:
  no screenshots; only redacted issue and repo records.
- High-risk checks:
  no secrets printed, no token expansion requested, no production mutation, and
  no scope broadening beyond one Redis action.
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
- Reality status: partially verified

## Deployment / Ops Evidence
- Deploy impact: high
- Env or secret changes:
  none
- Health-check impact:
  no live runtime state changed in this lane
- Smoke steps updated:
  DRE must rerun bounded readiness smoke after accepted owner action
- Rollback note:
  if rejected, no mutation occurs and the blocker remains fail-closed
- Observability or alerting impact:
  none in this lane
- Staged rollout or feature flag:
  not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  Redis recovery is blocked by missing deploy permission, not by unclear
  diagnosis.
- Gaps:
  no active direct mutation owner exists in the current Paperclip roster.
- Inconsistencies:
  older state files still speak about generic Ops/Security owner paths, while
  the current issue needed an exact July 17, 2026 route.
- Architecture constraints:
  Coolify production mutation remains a protected owner lane.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files:
  none
- Sources scanned:
  `LUC-1374` and `LUC-1382` comments, shared credential policy, release safety,
  repo state heads, and DRE evidence packet
- Rows created or corrected:
  `LUC-1387` task/evidence entries and state summaries
- Assumptions recorded:
  safe assumption that board/operator is the remaining approval owner because
  the roster has no separate active Ops Release Lead lane
- Blocking unknowns:
  whether board/operator will approve the one-action Redis restart lane
- Why it was safe to continue:
  this lane changed only governance state and docs, not runtime

### 2. Select One Priority Mission Objective
- Selected task:
  restore the exact owner path for one Redis recovery action
- Priority rationale:
  it is the direct blocker on the live Soar production readiness incident
- Why other candidates were deferred:
  other Soar work would not unblock the current Redis recovery gate

### 3. Plan Implementation
- Files or surfaces to modify:
  `history/tasks`, `history/evidence`, `.agents/state/system-health.md`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`, and the
  current Paperclip issue interaction state
- Logic:
  convert the generic blocker into a typed board/operator decision packet
- Edge cases:
  if the board rejects live mutation, keep the issue blocked fail-closed

### 4. Execute Implementation
- Implementation notes:
  documented the owner-path packet, synced repo truth, and opened a
  `request_confirmation` interaction limited to one Redis restart action.

### 5. Verify and Test
- Validation performed:
  cross-checked issue context, related comments, roster, and updated repo
  records for scope alignment
- Result:
  PASS for documentation/governance scope; runtime mutation intentionally not
  performed in this lane

### 6. Self-Review
- Simpler option considered:
  leaving a comment only
- Technical debt introduced: no
- Scalability assessment:
  the pattern is reusable for future protected one-action owner-path restores
- Refinements made:
  chose typed `request_confirmation` over inert `in_progress`

### 7. Update Documentation and Knowledge
- Docs updated:
  task/evidence packet plus top-level state summaries
- Context updated:
  yes
- Learning journal updated: not applicable
