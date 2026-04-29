# Task

## Header
- ID: V1REOPEN-00
- Title: Freeze the same-symbol LIVE close/reopen drift and execution packet
- Task Type: research
- Current Stage: analysis
- Status: DONE
- Owner: Planning Agent
- Depends on: none
- Priority: P0

## Context

Fresh real-account notes show a new `LIVE` regression after a successful manual
close on `DOGEUSDT`: a reopened position on the same symbol is imported again,
but the app shows a wildly wrong `PnL%`, and `TTP` behavior before the close
still contradicts the already frozen loss-side-only `DCA` rule.

## Goal

Produce one canonical analysis packet for the exact `LIVE close -> reopen same
symbol` regression class so implementation can proceed without guesswork or
hotfix-style patching.

## Deliverable For This Stage

A planning packet that:

- records the strongest likely root causes,
- defines the exact scope for reconciliation, runtime-state, and operator-truth
  fixes,
- and queues the next focused implementation steps.

## Constraints

- use existing approved lifecycle and runtime systems
- do not invent a parallel ownership or protection model
- do not implement workarounds
- stay within the declared current stage unless explicit approval changes it

## Definition of Done

- [x] One canonical planning packet is published under `docs/planning/`
- [x] The packet distinguishes likely stale-lifecycle drift from simple UI math
- [x] Queue/context docs are synchronized to the new packet
- [x] The frozen next steps are implementation-ready

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
  - reviewed reconciliation flow for imported `LIVE` positions
  - reviewed runtime protection-state lifecycle paths
  - reviewed dashboard PnL derivation seams
  - reviewed protection-rule contract for `TTP` versus loss-side-only `DCA`
- Screenshots/logs: not applicable
- High-risk checks:
  - kept root-cause hypotheses separated from proven implementation status

## Architecture Evidence (required for architecture-impacting tasks)

- Architecture source reviewed: yes
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none from this analysis slice

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

The strongest current hypothesis is stale lifecycle continuity, not a simple
PnL display formula bug. The implementation wave should start by freezing red
coverage for same-symbol close/reopen and stale runtime protection-state carry.

## Production-Grade Required Contract

### Goal

Freeze one exact execution packet for same-symbol `LIVE` close/reopen truth.

### Scope

- planning docs
- queue/context sync
- no runtime code changes

### Implementation Plan

1. Review reconciliation, runtime-state, and operator-derivation seams.
2. Classify the likely drift against approved lifecycle architecture.
3. Publish the canonical execution packet.
4. Sync queue/context docs.

### Acceptance Criteria

- The packet names the most likely root-cause classes.
- The packet scopes fixes to existing approved systems.
- The packet freezes the next red->green implementation sequence.

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

- Task summary: published the canonical same-symbol `LIVE` close/reopen
  hardening packet
- Files changed: planning packet plus canonical queue/context sync
- How tested: `pnpm run quality:guardrails`
- What is incomplete: focused regression locks and implementation wave
- Next steps: `V1REOPEN-01..07`
- Decisions made:
  - treat the bug as lifecycle/state truth first, not UI math first
  - keep the fix inside approved reconciliation/runtime systems
  - verify TTP semantics through lifecycle continuity rather than changing the
    already frozen protection rule
