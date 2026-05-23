# Task

## Header
- ID: V1TRUTH-00
- Title: Publish final LIVE exchange-truth packet
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: user-approved staged direction from 2026-04-29 analysis
- Priority: P0

## Context
Fresh analysis of the user-reported real-account behavior confirmed that the
remaining money-path risk is concentrated in one `LIVE exchange truth` wave:
manual exchange order versus position truth, leverage-aware futures manual
order sizing, manual app close authority in `LIVE`, and one final explicit
`DCA/TTP/TSL` rule freeze.

## Goal
Publish one canonical execution packet that closes `V1` on truthful `LIVE`
behavior first while deferring multi-strategy-per-bot architecture to a
post-`V1` wave.

## Deliverable For This Stage
A planning packet with exact scope, acceptance criteria, validation commands,
and queue/context synchronization for the follow-up `V1TRUTH-A` wave, plus a
deferred post-`V1` plan reference for `BOTMULTI-A`.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Canonical packet published under `docs/planning/`
- [x] Queue/context files updated for `V1TRUTH-A`
- [x] Deferred post-`V1` multi-strategy follow-up recorded explicitly
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
- Manual checks: packet reviewed against architecture and current LIVE runtime
  code paths
- Screenshots/logs: not applicable
- High-risk checks: staged direction keeps multi-strategy architecture out of
  the `V1` hardening wave

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: freeze final `DCA/TTP/TSL` rule in
  `V1TRUTH-07`; defer multi-strategy architecture work to `BOTMULTI-A`

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
The packet intentionally separates two concerns:

1. finish `V1` on truthful `LIVE` money paths;
2. reopen multi-strategy-per-bot only after that closure, as an architecture
   wave instead of a concurrent fix track.

## Production-Grade Required Contract

### Goal
Make the final `V1` hardening wave explicit, testable, and architecture-aligned
for real-money `LIVE` operation.

### Scope
- planning docs
- canonical queue/context sync
- deferred post-`V1` follow-up reference
- no runtime code in this stage

### Implementation Plan
1. Capture the remaining `LIVE` exchange-truth drifts.
2. Publish the packet with scope, risks, and acceptance criteria.
3. Record the approved staged decision and deferred `BOTMULTI-A` direction.
4. Sync queue/context.
5. Run guardrails.

### Acceptance Criteria
- The packet defines one narrow `V1TRUTH-A` wave for `LIVE` truth hardening.
- Queue/context docs point to `V1TRUTH-01..09`.
- Deferred multi-strategy work is recorded as post-`V1`.
- No runtime code changes are mixed into the planning task.

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

- Task summary: Published the `V1TRUTH-A` planning packet for final `LIVE`
  exchange-truth hardening and recorded deferred `BOTMULTI-A`.
- Files changed: planning packet plus canonical queue/context sync
- How tested: `pnpm run quality:guardrails`
- What is incomplete: audit, architecture freeze, code, tests, closure evidence
- Next steps: implement `V1TRUTH-01..09`, then execute `BOTMULTI-A`
- Decisions made: keep singular bot architecture through `V1`; defer
  multi-strategy-per-bot to post-`V1`
