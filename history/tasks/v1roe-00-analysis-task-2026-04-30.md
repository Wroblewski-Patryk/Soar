# Task

## Header
- ID: V1ROE-00
- Title: Freeze LIVE PnL/ROE semantics drift and imported automation-staleness packet
- Task Type: research
- Current Stage: analysis
- Status: DONE
- Owner: Planning Agent
- Depends on: none
- Priority: P0

## Context

Fresh production notes for `LIVE DOGEUSDT` show that operator-visible `PnL %`
still diverges materially from Binance Futures, and the same position appears
not to execute `DCA` despite crossing Soar's current leveraged-move thresholds.

## Goal

Produce one canonical analysis packet that separates:

- operator percent semantics drift versus exchange truth,
- from the narrower imported/reopened `LIVE` automation continuity bug.

## Deliverable For This Stage

- one planning packet under `docs/planning/`
- synchronized queue/context notes
- explicit valid options for the required user decision

## Constraints

- use existing approved lifecycle and runtime systems
- do not implement workarounds
- do not redefine lifecycle semantics without explicit approval
- stay within the declared current stage unless explicit approval changes it

## Definition of Done

- [x] One canonical planning packet is published under `docs/planning/`
- [x] The packet separates percent-semantics drift from runtime-staleness drift
- [x] The packet names valid implementation options
- [x] Queue/context docs are synchronized to the new packet

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
- Manual checks:
  - reviewed production-protected runtime session and aggregate API truth for the active `LIVE` bot
  - reviewed current web/runtime `PnL %` derivation
  - reviewed runtime lifecycle engine `DCA` trigger semantics
  - reviewed exchange snapshot normalization for margin truth
- Screenshots/logs: authenticated production dashboard/API notes from current session
- High-risk checks:
  - kept architecture decision separate from ordinary runtime bugfix scope

## Architecture Evidence (required for architecture-impacting tasks)

- Architecture source reviewed: yes
- Fits approved architecture: no
- Mismatch discovered: yes
- Decision required from user: yes
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: blocked pending product decision

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

Current repository evidence supports two simultaneous conclusions:

- the displayed `PnL %` semantics are not exchange ROE semantics,
- and the imported/reopened `LIVE` automation path still appears stale enough
  to miss `DCA/TTP` evaluation.

## Production-Grade Required Contract

### Goal

Freeze one exact execution packet for `LIVE` percent semantics versus imported
automation continuity.

### Scope

- planning docs
- queue/context sync
- no runtime code changes

### Implementation Plan

1. Review protected production runtime/API evidence.
2. Review current lifecycle engine threshold semantics.
3. Review current UI/runtime percent derivation.
4. Publish the canonical analysis packet and options.
5. Sync queue/context docs.

### Acceptance Criteria

- The packet clearly identifies the architecture decision point.
- The packet clearly identifies the independent runtime continuity bug.
- The next implementation slices are frozen but blocked by decision.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: partial
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: partial
- Regression check performed: repository guardrails

## Result Report

- Task summary: published the `LIVE` PnL/ROE semantics and imported automation parity packet
- Files changed: planning packet plus queue/context sync
- How tested: `pnpm run quality:guardrails`
- What is incomplete: implementation is blocked pending explicit product decision
- Next steps: `V1ROE-01..05`
- Decisions made:
  - separate operator percent semantics from runtime automation staleness
  - do not change lifecycle threshold semantics without explicit approval
  - prioritize imported/reopened `LIVE` automation continuity in every option
