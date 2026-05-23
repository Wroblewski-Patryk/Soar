# Task

## Header
- ID: V1MARK-00
- Title: Publish LIVE futures mark-price parity packet
- Task Type: research
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: V1COVER-A closure
- Priority: P0

## Context
`LIVE FUTURES` runtime protection now reuses one lifecycle-price seam, but that
seam still resolves only ticker `lastPrice` and candle close fallback. For real
futures money paths this is weaker than exchange mark-price truth.

## Goal
Publish one canonical packet that narrows the next live-runtime slice to
futures mark-price parity instead of a broad architecture rewrite.

## Deliverable For This Stage
A planning packet with exact scope, acceptance criteria, validation commands,
and queue/context synchronization for the follow-up implementation wave.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Canonical packet published under `docs/planning/`
- [x] Queue/context files updated for `V1MARK-A`
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
- Manual checks: planning packet reviewed against runtime and market-stream code
- Screenshots/logs: not applicable
- High-risk checks: scope remains futures-runtime-only

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: freeze lifecycle-price hierarchy in
  `V1MARK-01`

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
This packet intentionally stays narrow: it targets `LIVE FUTURES` lifecycle
price truth only, because that is the strongest remaining architecture-aligned
gap that can still distort DCA/TTP/TSL timing in production.

## Production-Grade Required Contract

### Goal
Make the next runtime slice explicit, testable, and architecture-aligned for
real-money `LIVE FUTURES` protection.

### Scope
- planning docs
- canonical queue/context sync
- no runtime code in this stage

### Implementation Plan
1. Capture the exact futures mark-price drift.
2. Publish the packet with file scope and acceptance criteria.
3. Sync queue/context.
4. Run guardrails.

### Acceptance Criteria
- The packet defines one narrow `V1MARK-A` wave.
- Queue/context docs point to `V1MARK-01..05`.
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

- Task summary: Published the `V1MARK-A` planning packet for live futures
  mark-price parity.
- Files changed: planning packet plus canonical queue/context sync
- How tested: `pnpm run quality:guardrails`
- What is incomplete: architecture contract, code, tests, closure evidence
- Next steps: implement `V1MARK-01..05`
- Decisions made: keep the wave futures-only and reuse the existing lifecycle
  price seam instead of inventing a new pricing subsystem
