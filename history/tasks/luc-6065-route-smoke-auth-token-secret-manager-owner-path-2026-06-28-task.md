# Task

## Header
- ID: LUC-6065
- Title: Route SMOKE_AUTH_TOKEN secret-manager mutation owner path
- Task Type: release
- Current Stage: post-release
- Status: DONE
- Owner: CTO
- Depends on: [LUC-6066](/LUC/issues/LUC-6066)
- Priority: P0
- Module Confidence Rows: deployment/protected smoke
- Requirement Rows: protected readiness smoke
- Quality Scenario Rows: security, operations
- Risk Rows: stale protected smoke credential binding
- Iteration: 2026-06-28
- Operation Mode: BUILDER
- Mission ID: LUC-6065-SMOKE-AUTH-TOKEN-OWNER-PATH-2026-06-28
- Mission Status: DONE

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected risk and quality rows were identified at a release-gate level.
- [x] The task improves release confidence by routing the actual protected-smoke credential blocker.

## Context
[LUC-6037](/LUC/issues/LUC-6037) verified that the current runner still injects
`SMOKE_AUTH_TOKEN` by name/shape only and that current-binding protected smoke
fails closed on `/workers/ready -> 401`. Fresh-login smoke passes protected
`/workers/ready -> 200` after process-local token clearing.

The remaining work is not a Soar application-code defect. It requires a
board-capable or secret-authorized Paperclip owner to mutate the central
secret-manager binding without exposing values.

## Goal
Route the actual central `SMOKE_AUTH_TOKEN` removal or rotation to the narrowest
valid owner path, then keep [LUC-6037](/LUC/issues/LUC-6037) blocked until the
mutation or owner decision completes.

## Scope
- Paperclip issue context for [LUC-6065](/LUC/issues/LUC-6065).
- No-value runner environment presence/shape check.
- No-value Paperclip secret metadata authorization check.
- Child issue routing for board-capable secret-manager mutation.
- No app code, deploy, restart, account, exchange, DB, Redis, or live-trading mutation.

## Implementation Plan
1. Read scoped wake payload and issue context.
2. Confirm current actor cannot use the secret-manager metadata route.
3. Confirm current runner binding state by name/shape only.
4. Create one child issue for the board-capable mutation owner path.
5. Mark [LUC-6065](/LUC/issues/LUC-6065) blocked by that child.

## Acceptance Criteria
- Binding source is handled only by metadata/name or presence/shape evidence.
- No secret values are printed or written.
- A first-class owner-path blocker exists for the actual mutation.
- [LUC-6065](/LUC/issues/LUC-6065) no longer remains `in_progress` without a live path.

## Definition of Done
- [x] No-value checks completed.
- [x] Child owner-path issue created: [LUC-6066](/LUC/issues/LUC-6066).
- [x] Parent issue disposition recorded with blocker owner and next action.
- [x] Child owner-path issue completed: [LUC-6066](/LUC/issues/LUC-6066) removed the central `SMOKE_AUTH_TOKEN` binding from affected agent env configs by metadata/name only.
- [x] [LUC-6037](/LUC/issues/LUC-6037) is ready to resume for current-binding protected smoke recheck.

## Forbidden
- Print secret values.
- Write secrets to repo files, issue comments, screenshots, logs, or artifacts.
- Deploy, restart, rollback, or mutate production accounts.
- Mutate exchange/live-trading state.
- Treat process-local env clearing as central rotation.

## Validation Evidence
- Tests: not applicable; no code changed.
- Manual checks:
  - `GET /api/issues/{LUC-6065}/heartbeat-context` returned current issue and parent blocker context.
  - `GET /api/companies/{companyId}/secrets` returned `403 Board access required`.
  - Runner `SMOKE_AUTH_TOKEN` presence/shape check returned present, length `36`, not JWT-shaped; no value printed.
  - Runner `SMOKE_AUTH_EMAIL` and `SMOKE_AUTH_PASSWORD` were present by name/length only; no values printed.
- High-risk checks: no secret value readback, no deploy/restart, no production/account/exchange mutation.
- Module confidence ledger updated: not applicable; routing-only blocker.
- Requirements matrix updated: not applicable; requirement remains blocked pending [LUC-6066](/LUC/issues/LUC-6066).
- Risk register updated: not applicable; existing stale-token risk remains open.
- Reality status: blocked.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none by CTO.
- Health-check impact: protected smoke remains fail-closed on stale current binding until [LUC-6066](/LUC/issues/LUC-6066) resolves.
- Smoke steps updated: no.
- Rollback note: not applicable.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: [LUC-6065](/LUC/issues/LUC-6065) blocks [LUC-6037](/LUC/issues/LUC-6037); [LUC-5869](/LUC/issues/LUC-5869) remains the original stale-token lane but is assigned under a paused Security chain.
- Gaps: central secret-manager mutation is denied to CTO/DRE actor class.
- Inconsistencies: current runner has stale token binding while fresh-login auth works.
- Architecture constraints: secret mutation must stay inside approved Paperclip secret management.

### 2. Select One Priority Mission Objective
- Selected task: route the mutation owner path.
- Priority rationale: release-critical protected smoke false-negative.
- Why other candidates were deferred: app code, deploy, and broader smoke reruns cannot resolve the central stale binding.

### 3. Plan Implementation
- Files or surfaces to modify: Paperclip issue graph and this task evidence file.
- Logic: create a single board-capable child blocker.
- Edge cases: avoid duplicate cleanup issues; do not expose secret identifiers or values in comments.

### 4. Execute Implementation
- Implementation notes: created [LUC-6066](/LUC/issues/LUC-6066), assigned to [00 AIA](/LUC/agents/00-aia-ai-assistant), as the board-capable mutation path.

### 5. Verify and Test
- Validation performed: API readbacks and no-value env checks.
- Result: CTO cannot mutate; owner path routed.

### 6. Self-Review
- Simpler option considered: directly mutate secret binding.
- Technical debt introduced: no.
- Scalability assessment: first-class blocker avoids polling and duplicate stale-token lanes.
- Refinements made: kept [LUC-6066](/LUC/issues/LUC-6066) scoped to central secret-manager mutation only.

### 7. Update Documentation and Knowledge
- Docs updated: this task evidence file.
- Context updated: Paperclip issue graph.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.

## Result Report
- Task summary: Routed central stale `SMOKE_AUTH_TOKEN` mutation to [LUC-6066](/LUC/issues/LUC-6066), then verified the child issue completed the approved central Paperclip agent-config mutation path.
- Files changed: `history/tasks/luc-6065-route-smoke-auth-token-secret-manager-owner-path-2026-06-28-task.md`.
- How tested: Paperclip issue/context readback showed [LUC-6066](/LUC/issues/LUC-6066) `done`, [LUC-6065](/LUC/issues/LUC-6065) blocking [LUC-6037](/LUC/issues/LUC-6037), and [LUC-6037](/LUC/issues/LUC-6037) blocked only by [LUC-6065](/LUC/issues/LUC-6065). Prior no-value checks already confirmed CTO secret metadata denial and stale runner binding by presence/shape only.
- Handoff result: closing [LUC-6065](/LUC/issues/LUC-6065) automatically resumed [LUC-6037](/LUC/issues/LUC-6037) to `in_progress` with the DRE assignee. Direct CTO PATCH of [LUC-6037](/LUC/issues/LUC-6037) returned `403 Issue is outside this actor's authorization boundary`, so CTO did not mutate the parent issue directly.
- What is incomplete: DRE/QA current-binding protected smoke recheck remains to run under [LUC-6037](/LUC/issues/LUC-6037); this CTO owner-path task does not run the smoke.
- Next steps: [LUC-6037](/LUC/issues/LUC-6037) should resume with DRE/QA to verify the current protected `/workers/ready` smoke uses the fresh-login fallback path after central token binding removal.
- Decisions made: [LUC-6065](/LUC/issues/LUC-6065) can close as `done`; [LUC-6037](/LUC/issues/LUC-6037) can be unblocked for verification because the secret-manager mutation owner path is complete.
