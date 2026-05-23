# Task

## Header
- ID: V1HIST-00
- Title: Freeze imported exchange lifecycle history truth and live verification scope
- Task Type: research
- Current Stage: analysis
- Status: DONE
- Owner: Planning Agent
- Depends on: none
- Priority: P0

## Context

Fresh `LIVE` notes revealed that Soar can already import and manage an exchange
position, but does not yet preserve enough lifecycle history truth for that
imported position. The imported row appears in active positions, while history
still lacks operator-complete open/close continuity.

## Goal

Produce one canonical analysis packet for imported exchange lifecycle history
truth and one explicit operator verification matrix for mixed-origin
`exchange/app` scenarios, so implementation can proceed without guesswork.

## Deliverable For This Stage

- one planning packet for imported lifecycle history truth
- one detailed mixed-origin live verification matrix
- synchronized queue/context docs

## Constraints

- use existing approved lifecycle and reconciliation systems
- do not invent a parallel history ledger
- do not implement workarounds
- stay within the declared current stage unless explicit approval changes it

## Definition of Done

- [x] One canonical planning packet is published under `docs/planning/`
- [x] One explicit mixed-origin operator verification matrix is published under `docs/operations/`
- [x] The packet distinguishes missing lifecycle-ledger truth from UI-only history presentation drift
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
  - reviewed import and stale-close reconciliation flow for `EXCHANGE_SYNC` positions
  - reviewed exchange-event close path versus reconciliation close path
  - reviewed runtime history read path and dashboard history timestamp presentation
  - reviewed current manual verification matrix against the newly reported operator scenarios
- Screenshots/logs: not applicable
- High-risk checks:
  - kept proven repository gaps separate from still-inferred exchange-boundary extension needs

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

The strongest current repository evidence is that imported-position lifecycle
history is still snapshot-driven on the open-row side and too weak on the
history-ledger side. That is a `V1` completeness gap even if active position
truth already looks correct.

## Production-Grade Required Contract

### Goal

Freeze one exact execution packet for imported exchange lifecycle history truth.

### Scope

- planning docs
- operations verification matrix
- queue/context sync
- no runtime code changes

### Implementation Plan

1. Review import, close, and history read-model seams.
2. Classify the gap against approved lifecycle architecture.
3. Publish the canonical execution packet and operator matrix.
4. Sync queue/context docs.

### Acceptance Criteria

- The packet names the real missing lifecycle-history slices.
- The operator matrix explicitly covers mixed-origin and wait-based scenarios.
- The next implementation tasks are frozen and implementation-ready.

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

- Task summary: published the imported exchange lifecycle history planning packet and mixed-origin operator matrix
- Files changed: planning packet, operations matrix, canonical queue/context sync
- How tested: `pnpm run quality:guardrails`
- What is incomplete: implementation wave for imported history truth
- Next steps: `V1HIST-01..07`
- Decisions made:
  - treat the issue as missing lifecycle-history truth first, not just a history-table formatting bug
  - keep the fix inside approved lifecycle, reconciliation, and read-model systems
  - test mixed-origin `exchange/app` flows explicitly instead of assuming app-origin scenarios cover exchange-origin continuity
