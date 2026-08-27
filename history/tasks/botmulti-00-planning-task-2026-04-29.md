# Task

## Header
- ID: BOTMULTI-00
- Title: Publish deferred multi-strategy reintroduction packet
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: user-approved staged direction from 2026-04-29 analysis
- Priority: P1

## Context
The user approved a staged direction: `V1` must close first on the current
singular bot architecture, and only afterward should Soar reintroduce
multi-strategy-per-bot as an explicit architecture wave.

## Goal
Record the deferred post-`V1` architecture roadmap now, so the later rollout
does not get improvised or mixed into the final `LIVE` truth hardening wave.

## Deliverable For This Stage
A deferred planning packet that lists prerequisites, architecture files to
change first, execution order, and closure expectations for `BOTMULTI-A`.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Deferred post-`V1` packet published under `docs/planning/`
- [x] Queue/context files mention `BOTMULTI-A` as post-`V1`
- [x] Validation evidence recorded for planning-stage changes

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
- Tests: `pnpm run quality:guardrails`
- Manual checks: deferred packet reviewed against current singular-bot
  architecture and legacy compatibility remnants
- Screenshots/logs: not applicable
- High-risk checks: packet remains deferred until `V1TRUTH-A` closure

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: required in future `BOTMULTI-01`

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: not applicable

## Review Checklist (mandatory)
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

## Notes
This task does not reopen architecture. It only records the approved deferred
direction so the post-`V1` work starts from a frozen plan instead of ad hoc
implementation.

## Production-Grade Required Contract

### Goal
Preserve the user-approved staged roadmap in canonical files before later
implementation pressure arrives.

### Scope
- planning docs
- canonical queue/context sync
- no runtime code in this stage

### Implementation Plan
1. Record the staged decision.
2. Publish the deferred `BOTMULTI-A` packet.
3. Sync queue/context.
4. Run guardrails.

### Acceptance Criteria
- `BOTMULTI-A` is documented as post-`V1`.
- The packet names architecture prerequisites before implementation.
- No runtime or architecture code changes are mixed into the planning task.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: not applicable
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: repository guardrails

## Result Report

- Task summary: published the deferred `BOTMULTI-A` post-`V1` architecture
  roadmap
- Files changed: planning packet plus canonical queue/context sync
- How tested: `pnpm run quality:guardrails`
- What is incomplete: architecture updates, code, tests, closure evidence
- Next steps: keep deferred until `V1TRUTH-A` closure
- Decisions made: multi-strategy-per-bot remains intentionally out of current
  `V1` hardening scope
